import { NextResponse } from "next/server";
import { db } from "@/app/lib/db";
import { relations, users } from "@/app/lib/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { fromUuid, toUuid, myNickname } = await req.json();

    // 필수 필드 검증
    if (!fromUuid || !toUuid || !myNickname) {
      return NextResponse.json(
        {
          success: false,
          message: "필수 필드가 누락되었습니다. (fromUuid, toUuid, myNickname)",
        },
        { status: 400 }
      );
    }

    // 1. 관계 정보 저장
    await db.insert(relations).values({
      fromUuid,
      toUuid,
    });

    // 2. 공유한 사람(fromUuid)의 정보 조회
    const fromUserResult = await db
      .select({
        email: users.email,
        nickname: users.nickname,
      })
      .from(users)
      .where(eq(users.uuid, fromUuid));

    // 이메일이 있는 경우에만 발송
    if (fromUserResult.length > 0 && fromUserResult[0].email) {
      const { email, nickname: fromNickname } = fromUserResult[0];

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
        subject: `✨ ${myNickname}님과의 궁합 결과가 도착했어요!`,
        html: `
          <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #6B46C1; font-size: 24px; margin-bottom: 10px;">
                ✨ ${fromNickname}님과 ${myNickname}님의 궁합 결과가 도착했어요!
              </h1>
              <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                ${fromNickname}님과 ${myNickname}님의 감정 성향이<br/>
                얼마나 잘 맞는지 지금 바로 확인해보세요!
              </p>
              <a 
                href="${process.env.NEXT_PUBLIC_DOMAIN_URL}/me/${fromUuid}" 
                style="display: inline-block; background-color: #6B46C1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;"
              >
                궁합 결과 확인하기
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
    }

    return NextResponse.json({
      success: true,
      message: "관계가 성공적으로 저장되었습니다.",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "관계 저장 중 오류가 발생했습니다.",
      },
      { status: 500 }
    );
  }
}
