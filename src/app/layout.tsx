import type React from "react";
import "@/app/globals.css";
import Script from "next/script"; // ✅ 이거 꼭 추가!
import LocalStorageInitializer from "@/components/LocalStorageInitializer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Who Inside",
  description: "나의 내면 속 유형을 알아보세요",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png", sizes: "32x32" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      <body className={inter.className}>
        <LocalStorageInitializer />
        {children}
      </body>
    </html>
  );
}
