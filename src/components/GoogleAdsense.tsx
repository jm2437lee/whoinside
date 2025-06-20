"use client";

import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
    googleAdsenseInitialized?: boolean;
  }
}

interface GoogleAdsenseProps {
  loadScript?: boolean;
  slot?: string;
}

export const GoogleAdsense = ({
  loadScript = false,
  slot = "9339664314",
}: GoogleAdsenseProps) => {
  return (
    <>
      {/* 스크립트는 한 번만 로드되도록 제어 */}
      {loadScript && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8283413819468215"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onLoad={() => {
            // 전역 초기화 플래그 설정
            if (typeof window !== "undefined") {
              window.googleAdsenseInitialized = true;
            }
          }}
        />
      )}
    </>
  );
};
