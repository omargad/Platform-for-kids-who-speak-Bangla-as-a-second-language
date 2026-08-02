import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";
import { bootstrapSql } from "./bootstrap";

type Db = BetterSQLite3Database<typeof schema>;

// Reuse one connection across hot reloads and route invocations.
const globalState = globalThis as typeof globalThis & { __banglaAdventuresDb?: Db };

export async function getDb(): Promise<Db> {
  if (globalState.__banglaAdventuresDb) return globalState.__banglaAdventuresDb;

  const file =
    process.env.DATABASE_PATH ?? path.join(process.cwd(), ".data", "bangla-adventures.db");
  fs.mkdirSync(path.dirname(file), { recursive: true });

  const sqlite = new Database(file);
  sqlite.pragma("journal_mode = WAL");
  sqlite.pragma("foreign_keys = ON");
  sqlite.exec(bootstrapSql);

  globalState.__banglaAdventuresDb = drizzle(sqlite, { schema });
  return globalState.__banglaAdventuresDb;
}
