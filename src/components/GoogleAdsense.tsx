"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdsenseProps {
  loadScript?: boolean; // 스크립트 로드 여부를 제어
}

export const GoogleAdsense = ({ loadScript = false }: GoogleAdsenseProps) => {
  useEffect(() => {
    // 개발 환경에서는 AdSense 초기화하지 않음
    if (process.env.NODE_ENV === "development") {
      console.log("AdSense disabled in development environment");
      return;
    }

    // 광고 초기화
    const initAds = () => {
      try {
        if (typeof window !== "undefined" && window.adsbygoogle) {
          (window.adsbygoogle = window.adsbygoogle || []).push({});
        }
      } catch (error) {
        console.error("AdSense error:", error);
      }
    };

    // DOM이 완전히 로드된 후 광고 초기화
    const timer = setTimeout(initAds, 2000);
    return () => clearTimeout(timer);
  }, []);

  // 개발 환경에서는 플레이스홀더 표시
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="w-full my-4 flex justify-center">
        <div
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm"
          style={{ minHeight: "250px", width: "100%" }}
        >
          [AdSense 광고 영역 - 개발 모드]
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 스크립트는 한 번만 로드되도록 제어 */}
      {loadScript && (
        <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8283413819468215"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      )}
    </>
  );
};
