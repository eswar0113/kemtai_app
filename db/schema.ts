import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { v4 as uuid } from "uuid";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => uuid()),
  email: text("email").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date())
});

export const workouts = sqliteTable("workouts", {
  id: text("id").primaryKey().$defaultFn(() => uuid()),
  userId: text("user_id").notNull().references(() => users.id),
  exercise: text("exercise").notNull(),
  reps: integer("reps").default(0),
  accuracy: integer("accuracy").default(0),
  durationMs: integer("duration_ms", { mode: "number" }).default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date())
});



