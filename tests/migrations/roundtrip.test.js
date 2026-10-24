import { test, expect, beforeAll, afterAll } from "vitest";
import { migrateUp, migrateDown, loadMigrations } from "../../scripts/migrate.js";
import { freshTestDb } from "../helpers/testDb.js";
// Testing migrations: every migration must apply, revert, and apply again cleanly.
let db;
beforeAll(async () => { db = await freshTestDb(); });
afterAll(async () => db.end());
const quiet = () => {};
async function tables() {
 const sql = "SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename";
 return (await db.query(sql)).rows.map((r) => r.tablename);
}
async function history() {
 const sql = "SELECT version FROM schema_migrations ORDER BY version";
 return (await db.query(sql)).rows.map((r) => r.version);
}
test("all migrations are applied and recorded", async () => {
 expect(await history()).toEqual(loadMigrations().map((m) => m.version));
});
test("every migration can be reverted and re-applied", async () => {
 const count = loadMigrations().length;
 for (let i = 0; i < count; i++) await migrateDown(db, quiet);
 expect(await tables()).toEqual(["schema_migrations"]);
 await migrateUp(db, quiet);
 expect(await history()).toHaveLength(count);
});
test("running migrate twice applies nothing the second time", async () => {
 const lines = [];
 await migrateUp(db, (l) => lines.push(l));
 expect(lines).toEqual(["schema is up to date, nothing to apply"]);
});