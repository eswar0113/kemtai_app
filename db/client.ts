import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "./schema";
import { mkdir } from "fs/promises";
import { dirname } from "path";

let db: ReturnType<typeof drizzle> | null = null;

async function initDb() {
  if (db) return db;

  const dbPath = process.env.DATABASE_URL || "/var/data/data.db";
  
  // Ensure directory exists
  const dbDir = dirname(dbPath);
  try {
    await mkdir(dbDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore
  }

  const sqlite = new Database(dbPath);
  db = drizzle(sqlite, { schema });
  return db;
}

export async function getDb() {
  return initDb();
}