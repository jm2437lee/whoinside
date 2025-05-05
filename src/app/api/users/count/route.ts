import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";
import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const result = await db
      .select({
        count: sql<number>`COUNT(*)`,
      })
      .from(users);

    const count = Number(result[0].count);

    return NextResponse.json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Error getting user count:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
