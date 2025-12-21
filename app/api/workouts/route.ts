import { NextResponse } from "next/server";
import { db } from "@/db/client";
import { workouts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

const defaultUser = "demo-user";

export async function GET() {
  const rows = await db
    .select()
    .from(workouts)
    .where(eq(workouts.userId, defaultUser))
    .orderBy(desc(workouts.createdAt));
  if (!rows.length) {
    await db.insert(workouts).values([
      { userId: defaultUser, exercise: "squat", reps: 12, accuracy: 88, durationMs: 180000 },
      { userId: defaultUser, exercise: "pushup", reps: 10, accuracy: 82, durationMs: 120000 }
    ]);
    const seeded = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, defaultUser))
      .orderBy(desc(workouts.createdAt));
    return NextResponse.json({ workouts: seeded });
  }
  return NextResponse.json({ workouts: rows });
}

export async function POST(req: Request) {
  const body = await req.json();
  const payload = {
    userId: defaultUser,
    exercise: body.exercise ?? "squat",
    reps: body.reps ?? 0,
    accuracy: body.accuracy ?? 0,
    durationMs: body.durationMs ?? 0
  };
  const inserted = await db.insert(workouts).values(payload).returning().get();
  return NextResponse.json({ workout: inserted });
}

