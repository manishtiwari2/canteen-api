import pg from "pg";
import { migrateUp } from "../../scripts/migrate.js";
// Integration tests use a SEPARATE, disposable database - never dev or production.
export async function freshTestDb() {
 const url = process.env.TEST_DATABASE_URL;
 if (!url) throw new Error("TEST_DATABASE_URL is not set (see .env.example)");
 const client = new pg.Client({ connectionString: url });
 await client.connect();
 await client.query("DROP SCHEMA public CASCADE; CREATE SCHEMA public;");
 await migrateUp(client, () => {});
 return client;
}