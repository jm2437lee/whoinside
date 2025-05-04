import { db } from "@/app/lib/db";
import { users } from "@/app/lib/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

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

    try {
      if (existing.length > 0) {
        // 기존 사용자가 있으면 이메일만 업데이트
        await db.update(users).set({ email }).where(eq(users.uuid, uuid));
      } else {
        // 사용자가 없으면 새로 생성
        await db.insert(users).values({
          uuid,
          email,
          type,
          nickname,
        });
      }

      // 이메일 발송
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const mailOptions = {
        from: `"Who Inside" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: `✨ 감정 성향 결과 페이지가 준비되었어요!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6B46C1; font-size: 24px; margin-bottom: 10px;">
                ✨ 감정 성향 결과 페이지가 준비되었어요!
              </h1>
              <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                감정 성향 결과 페이지를 확인하고<br/>
                친구들과 궁합도 알아보세요!
              </p>
              <a 
                href="${process.env.NEXT_PUBLIC_DOMAIN_URL}/me/${uuid}" 
                style="display: inline-block; background-color: #6B46C1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;"
              >
                결과 페이지 확인하기
              </a>
              <p style="color: #718096; font-size: 14px; margin-top: 30px; padding: 20px; background-color: #F7FAFC; border-radius: 8px;">
                더 많은 친구들과 함께 테스트에 참여하고<br/>
                우리의 감정 궁합을 알아보세요! 💕
              </p>
            </div>
          </div>
        `,
      };

      await transporter.sendMail(mailOptions);

      return NextResponse.json({
        success: true,
        message: "이메일이 성공적으로 저장되었습니다.",
      });
    } catch (dbError: any) {
      // MySQL unique constraint violation error code
      if (dbError.code === "ER_DUP_ENTRY") {
        return NextResponse.json(
          { success: false, message: "이미 등록된 이메일입니다." },
          { status: 400 }
        );
      }
      throw dbError;
    }
  } catch (error) {
    console.error("Error updating email:", error);
    return NextResponse.json(
      { success: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
