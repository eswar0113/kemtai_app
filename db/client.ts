import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const dbPath = isProd
  ? "/var/data/data.db"               // Render persistent disk
  : path.join(process.cwd(), "data.db"); // Local

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite);
