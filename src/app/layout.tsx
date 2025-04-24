import type React from "react";
import "@/app/globals.css";
import Script from "next/script"; // ✅ 이거 꼭 추가!

export const metadata = {
  title: "감정 성향 테스트 | 당신의 감정 성향을 알아보세요",
  description: "10가지 질문으로 알아보는 당신의 감정 성향 테스트",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        {/* ✅ Kakao JavaScript SDK 삽입 */}
        <Script
          src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
          strategy="beforeInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
