"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
    googleAdsenseInitialized?: boolean;
  }
}

interface GoogleAdsenseProps {
  loadScript?: boolean;
}

export const GoogleAdsense = ({ loadScript = false }: GoogleAdsenseProps) => {
  useEffect(() => {
    // 개발 환경에서는 실행하지 않음
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // Auto Ads 초기화
    const initAutoAds = () => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          // Auto Ads 활성화
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error("Auto Ads initialization error:", error);
      }
    };

    // 스크립트 로드 후 Auto Ads 초기화
    if (loadScript) {
      const timer = setTimeout(initAutoAds, 2000);
      return () => clearTimeout(timer);
    }
  }, [loadScript]);

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
