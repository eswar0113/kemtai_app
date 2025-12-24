import { NextResponse } from "next/server";
import { getDb } from "@/db/client";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  try {
    const db = await getDb();
    const { email } = await req.json();
    
    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Valid email required" }, { status: 400 });
    }
    
    // Validate email format
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    
    // Trim and lowercase email
    const normalizedEmail = email.trim().toLowerCase();

    const existing = await db.select().from(users).where(eq(users.email, normalizedEmail)).get();
    if (existing) {
      return NextResponse.json({ user: existing });
    }
    const inserted = await db.insert(users).values({ email: normalizedEmail }).returning().get();
    return NextResponse.json({ user: inserted });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



