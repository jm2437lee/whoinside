import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { uuid, nickname, type } = await req.json();

    if (!uuid || !nickname || !type) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    // 중복 체크
    const existing = await db.select().from(users).where(eq(users.uuid, uuid));

    if (existing.length > 0) {
      return NextResponse.json({ success: true, message: "Already exists" });
    }

    // 삽입
    await db.insert(users).values({
      uuid,
      nickname,
      type,
    });

    return NextResponse.json({ success: true, message: "User saved" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
