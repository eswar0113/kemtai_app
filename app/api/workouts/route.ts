import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { workouts } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

const DEMO_USER = "demo-user";
const VALID_EXERCISES = ["squat", "pushup", "lunge", "jumping-jack", "head-rotation"];

function validateWorkoutInput(data: any) {
  const errors: string[] = [];
  
  if (data.exercise && !VALID_EXERCISES.includes(data.exercise)) {
    errors.push("Invalid exercise type");
  }
  
  if (data.reps !== undefined && (typeof data.reps !== "number" || data.reps < 0 || data.reps > 10000)) {
    errors.push("Reps must be a number between 0 and 10000");
  }
  
  if (data.accuracy !== undefined && (typeof data.accuracy !== "number" || data.accuracy < 0 || data.accuracy > 100)) {
    errors.push("Accuracy must be between 0 and 100");
  }
  
  if (data.durationMs !== undefined && (typeof data.durationMs !== "number" || data.durationMs < 0 || data.durationMs > 3600000)) {
    errors.push("Duration must be between 0 and 3600000 ms");
  }
  
  return errors;
}

export async function GET() {
  try {
    const db = await getDb();
    const rows = await db
      .select()
      .from(workouts)
      .where(eq(workouts.userId, DEMO_USER))
      .orderBy(desc(workouts.createdAt));
    
    if (!rows.length) {
      await db.insert(workouts).values([
        { userId: DEMO_USER, exercise: "squat", reps: 12, accuracy: 88, durationMs: 180000 },
        { userId: DEMO_USER, exercise: "pushup", reps: 10, accuracy: 82, durationMs: 120000 }
      ]);
      const seeded = await db
        .select()
        .from(workouts)
        .where(eq(workouts.userId, DEMO_USER))
        .orderBy(desc(workouts.createdAt));
      return NextResponse.json({ workouts: seeded });
    }
    return NextResponse.json({ workouts: rows });
  } catch (error) {
    console.error("GET workouts error:", error);
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const body = await req.json();
    
    // Validate input
    const validationErrors = validateWorkoutInput(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }
    
    const payload = {
      userId: DEMO_USER,
      exercise: body.exercise ?? "squat",
      reps: typeof body.reps === "number" ? body.reps : 0,
      accuracy: typeof body.accuracy === "number" ? body.accuracy : 0,
      durationMs: typeof body.durationMs === "number" ? body.durationMs : 0
    };
    const inserted = await db.insert(workouts).values(payload).returning().get();
    return NextResponse.json({ workout: inserted });
  } catch (error) {
    console.error("POST workout error:", error);
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}

