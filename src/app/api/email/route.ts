import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, uuid } = await req.json();

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
      subject: "✨ 나의 감정 성향 결과가 도착했어요!",
      html: `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #6B46C1; font-size: 24px; margin-bottom: 10px;">
              ✨ 나의 감정 성향 결과가 도착했어요!
            </h1>
            <p style="color: #4A5568; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
              아래 버튼을 클릭하여<br/>
              나의 감정 성향 결과를 확인해보세요.
            </p>
            <a 
              href="https://whoinside.vercel.app/me/${uuid}" 
              style="display: inline-block; background-color: #6B46C1; color: white; padding: 15px 30px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 16px;"
            >
              결과 확인하기
            </a>
            <p style="color: #718096; font-size: 14px; margin-top: 30px; padding: 20px; background-color: #F7FAFC; border-radius: 8px;">
              개인정보 보호를 위해 이 링크는 6개월간만 유효합니다.<br/>
              결과 확인 후 저장해두시는 것을 추천드려요!
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ message: "이메일이 발송되었습니다." });
  } catch (error) {
    console.error("Email sending error:", error);
    return NextResponse.json(
      { error: "이메일 발송에 실패했습니다." },
      { status: 500 }
    );
  }
}
