import pg from "pg";
import { config } from "./config.js";
let pool;
export function getPool() {
 if (!config.databaseUrl) throw new Error("DATABASE_URL is not set (see .env.example)");
 pool ??= new pg.Pool({ connectionString: config.databaseUrl });
 return pool;
}
