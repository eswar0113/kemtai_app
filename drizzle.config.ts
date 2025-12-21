import type { Config } from "drizzle-kit";

const config: Config = {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "sqlite",
  dbCredentials: {
    url: process.env.DATABASE_URL || "/var/data/data.db"
  }
};

export default config;