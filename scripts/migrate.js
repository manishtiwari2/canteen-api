// A small migration runner - the same idea as the T3L2 slides.
//
// Usage:
//   node scripts/migrate.js up      - apply every pending migration, in version order
//   node scripts/migrate.js down    - revert the LAST applied migration
//                                     using its "-- migrate:down" section
//   node scripts/migrate.js status  - show which migrations are applied
//
// Each migration runs in ONE transaction together with its history row,
// so it commits completely or not at all.

import { readdirSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import pg from "pg";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.join(HERE, "..", "migrations");

export function loadMigrations(dir = MIGRATIONS_DIR) {
  const seen = new Map();

  return readdirSync(dir)
    .filter((f) => f.endsWith(".sql"))
    .sort()
    .map((file) => {
      const version = file.split("_")[0];

      if (seen.has(version)) {
        const other = seen.get(version);

        throw new Error(
          `Two migrations share version ${version}: ${other} and ${file}. ` +
            "Give each migration its own timestamp."
        );
      }

      seen.set(version, file);

      const text = readFileSync(path.join(dir, file), "utf8").replace(
        /\r\n/g,
        "\n"
      );

      const m = text.match(
        /--\s*migrate:up\s*\n([\s\S]*?)(?:--\s*migrate:down\s*\n([\s\S]*))?$/
      );

      if (!m) {
        throw new Error(
          `${file}: missing the "-- migrate:up" line`
        );
      }

      return {
        version,
        name: file.replace(/\.sql$/, ""),
        up: m[1].trim(),
        down: (m[2] || "").trim(),
        checksum: createHash("sha256")
          .update(text)
          .digest("hex")
          .slice(0, 16),
      };
    });
}

async function ensureHistoryTable(client) {
  await client.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version text PRIMARY KEY,
      name text NOT NULL,
      checksum text NOT NULL,
      applied_at timestamptz NOT NULL DEFAULT now()
    )
  `);
}

async function appliedRows(client) {
  const sql =
    "SELECT version, name, checksum FROM schema_migrations ORDER BY version";

  const { rows } = await client.query(sql);

  return new Map(rows.map((r) => [r.version, r]));
}

export async function migrateUp(client, log = console.log) {
  await ensureHistoryTable(client);

  const all = loadMigrations();
  const done = await appliedRows(client);

  // Verify that already-applied migrations have not been modified.
  for (const m of all) {
    const row = done.get(m.version);

    if (row && row.checksum !== m.checksum) {
      throw new Error(
        `Checksum mismatch for migration ${m.version}: ` +
          `applied ${row.checksum}, file is now ${m.checksum}. ` +
          "Never edit an applied migration - put the file back and write a NEW migration."
      );
    }
  }

  let count = 0;

  for (const m of all) {
    if (done.has(m.version)) {
      continue;
    }

    log(`applying ${m.name} ...`);

    await client.query("BEGIN");

    try {
      // Never queue forever behind a long-running query.
      // T3L2: lock_timeout.
      await client.query("SET LOCAL lock_timeout = '5s'");

      await client.query(m.up);

      await client.query(
        "INSERT INTO schema_migrations (version, name, checksum) VALUES ($1, $2, $3)",
        [m.version, m.name, m.checksum]
      );

      await client.query("COMMIT");

      count++;
    } catch (err) {
      await client.query("ROLLBACK");

      throw new Error(
        `${m.name} failed and was rolled back: ${err.message}`,
        { cause: err }
      );
    }
  }

  log(
    count
      ? `applied ${count} migration(s)`
      : "schema is up to date, nothing to apply"
  );
}

export async function migrateDown(client, log = console.log) {
  await ensureHistoryTable(client);

  const done = [...(await appliedRows(client)).values()];
  const last = done[done.length - 1];

  if (!last) {
    return log("nothing to revert");
  }

  const m = loadMigrations().find(
    (x) => x.version === last.version
  );

  if (!m || !m.down) {
    throw new Error(
      `${last.name} has no "-- migrate:down" section, so it cannot be reverted`
    );
  }

  await client.query("BEGIN");

  try {
    await client.query(m.down);

    await client.query(
      "DELETE FROM schema_migrations WHERE version = $1",
      [m.version]
    );

    await client.query("COMMIT");
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  }

  log(`reverted ${m.name}`);
}

export async function migrationStatus(client, log = console.log) {
  await ensureHistoryTable(client);

  const done = await appliedRows(client);

  for (const m of loadMigrations()) {
    log(`${done.has(m.version) ? "[x]" : "[ ]"} ${m.name}`);
  }
}

async function main() {
  const url = process.env.DATABASE_URL;

  if (!url) {
    console.error(
      "DATABASE_URL is not set. Copy .env.example to .env, or set it in the env."
    );

    process.exit(1);
  }

  const client = new pg.Client({
    connectionString: url,
  });

  const cmd = process.argv[2] || "up";

  const run = {
    up: migrateUp,
    down: migrateDown,
    status: migrationStatus,
  }[cmd];

  try {
    if (!run) {
      throw new Error(
        `unknown command "${cmd}" (use up, down or status)`
      );
    }

    await client.connect();
    await run(client);
  } catch (err) {
    // Connection errors such as ECONNREFUSED can arrive with an empty
    // message, so fall back to the error code or nested errors.
    const reason =
      err.message ||
      err.code ||
      err.errors?.map((e) => e.message).join("; ");

    console.error(`ERROR: ${reason}`);
    process.exitCode = 1;
  } finally {
    await client.end();
  }
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main();
}