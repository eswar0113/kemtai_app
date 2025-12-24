import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

function validateWorkoutUpdate(data: any) {
  const errors: string[] = [];
  
  if (data.reps !== undefined && (typeof data.reps !== "number" || data.reps < 0 || data.reps > 10000)) {
    errors.push("Reps must be a number between 0 and 10000");
  }
  
  if (data.accuracy !== undefined && (typeof data.accuracy !== "number" || data.accuracy < 0 || data.accuracy > 100)) {
    errors.push("Accuracy must be between 0 and 100");
  }
  
  if (data.durationMs !== undefined && (typeof data.durationMs !== "number" || data.durationMs < 0 || data.durationMs > 3600000)) {
    errors.push("Duration must be between 0 and 3600000 ms");
  }
  
  // Prevent updating userId, id, or exercise
  if (data.userId !== undefined || data.id !== undefined || data.exercise !== undefined) {
    errors.push("Cannot update userId, id, or exercise");
  }
  
  return errors;
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    const body = await req.json();
    
    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json({ error: "Invalid workout ID" }, { status: 400 });
    }
    
    // Validate input
    const validationErrors = validateWorkoutUpdate(body);
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(", ") }, { status: 400 });
    }
    
    await db.update(workouts).set(body).where(eq(workouts.id, params.id));
    const updated = await db.select().from(workouts).where(eq(workouts.id, params.id)).get();
    
    if (!updated) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }
    
    return NextResponse.json({ workout: updated });
  } catch (error) {
    console.error("PUT workout error:", error);
    return NextResponse.json({ error: "Failed to update workout" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  try {
    const db = await getDb();
    
    if (!params.id || typeof params.id !== "string") {
      return NextResponse.json({ error: "Invalid workout ID" }, { status: 400 });
    }
    
    const deleted = await db.delete(workouts).where(eq(workouts.id, params.id));
    
    if (!deleted) {
      return NextResponse.json({ error: "Workout not found" }, { status: 404 });
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE workout error:", error);
    return NextResponse.json({ error: "Failed to delete workout" }, { status: 500 });
  }
}



