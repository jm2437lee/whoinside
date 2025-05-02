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
      // 기존 사용자가 있으면 업데이트
      await db
        .update(users)
        .set({ nickname, type })
        .where(eq(users.uuid, uuid));

      return NextResponse.json({
        success: true,
        message: "User updated",
      });
    }

    // 새로운 사용자 삽입
    await db.insert(users).values({
      uuid,
      nickname,
      type,
    });

    return NextResponse.json({
      success: true,
      message: "User created",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { uuid, email, type, nickname } = await request.json();

    if (!uuid || !email) {
      return NextResponse.json(
        { success: false, message: "UUID와 이메일은 필수 입력값입니다." },
        { status: 400 }
      );
    }

    // 사용자 조회
    const existing = await db.select().from(users).where(eq(users.uuid, uuid));

    if (existing.length > 0) {
      // 기존 사용자가 있으면 이메일만 업데이트
      await db.update(users).set({ email }).where(eq(users.uuid, uuid));
    } else {
      // 사용자가 없으면 새로 생성
      // if (!type || !nickname) {
      //   return NextResponse.json(
      //     {
      //       success: false,
      //       message:
      //         "신규 사용자 생성을 위해서는 type과 nickname이 필요합니다.",
      //     },
      //     { status: 400 }
      //   );
      // }

      await db.insert(users).values({
        uuid,
        email,
        type,
        nickname,
      });
    }

    return NextResponse.json({
      success: true,
      message: "이메일이 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
