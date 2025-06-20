"use client";

import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
    adsenseAutoAdsInitialized?: boolean;
  }
}

interface GoogleAdsenseProps {
  loadScript?: boolean;
}

export const GoogleAdsense = ({ loadScript = false }: GoogleAdsenseProps) => {
  return (
    <>
      {loadScript && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8283413819468215"
          strategy="afterInteractive"
          crossOrigin="anonymous"
          onLoad={() => {
            // 전역 체크로 중복 방지
            if (
              typeof window !== "undefined" &&
              !window.adsenseAutoAdsInitialized
            ) {
              try {
                // AdSense 배열 초기화 (Auto Ads는 AdSense 대시보드에서 설정)
                window.adsbygoogle = window.adsbygoogle || [];
                window.adsbygoogle.push({});
                window.adsenseAutoAdsInitialized = true;
                console.log("AdSense initialized successfully");
              } catch (error) {
                console.error("AdSense initialization error:", error);
              }
            }
          }}
        />
      )}
    </>
  );
};
