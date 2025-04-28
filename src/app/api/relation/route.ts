import { db } from "@/app/lib/db";
import { relations } from "@/app/lib/schema";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { fromUuid, toUuid } = await req.json();

    if (!fromUuid || !toUuid) {
      return NextResponse.json(
        { success: false, message: "Missing fields" },
        { status: 400 }
      );
    }

    await db.insert(relations).values({
      fromUuid,
      toUuid,
    });

    return NextResponse.json({ success: true, message: "Relation saved" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
