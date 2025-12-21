import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  const body = await req.json();
  await db.update(workouts).set(body).where(eq(workouts.id, params.id));
  const updated = await db.select().from(workouts).where(eq(workouts.id, params.id)).get();
  return NextResponse.json({ workout: updated });
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const db = await getDb();
  await db.delete(workouts).where(eq(workouts.id, params.id));
  return NextResponse.json({ ok: true });
}



