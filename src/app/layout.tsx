import type React from "react";
import "@/app/globals.css";
import Script from "next/script"; // ✅ 이거 꼭 추가!
import LocalStorageInitializer from "@/components/LocalStorageInitializer";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "감정 성향 테스트",
  description: "나와 너의 감정 성향 우리 궁합은 얼마나 잘 맞을까? 👀",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_DOMAIN_URL || "https://whoinside.vercel.app"
  ),
  openGraph: {
    title: "감정 성향 테스트",
    description: "나와 너의 감정 성향 우리 궁합은 얼마나 잘 맞을까? 👀",
    images: [
      {
        url: "/main.png",
        width: 1200,
        height: 630,
        alt: "감정 성향 테스트",
      },
    ],
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "감정 성향 테스트",
    description: "나와 너의 감정 성향 우리 궁합은 얼마나 잘 맞을까? 👀",
    images: ["/main.png"],
  },
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
        {/* Google AdSense - 스크립트만 로드 (초기화 없음) */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8283413819468215"
          crossOrigin="anonymous"
        ></script>
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <GoogleAnalytics />
      </head>
      <body className={inter.className}>
        <LocalStorageInitializer />
        {children}
      </body>
    </html>
  );
}
