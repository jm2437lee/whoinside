"use client";

import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
    adsenseInitialized?: boolean;
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
            // 중복 초기화 방지
            if (typeof window !== "undefined" && !window.adsenseInitialized) {
              try {
                // Auto Ads 활성화
                (window.adsbygoogle = window.adsbygoogle || []).push({
                  google_ad_client: "ca-pub-8283413819468215",
                  enable_page_level_ads: true,
                });
                window.adsenseInitialized = true;
              } catch (error) {
                console.error("Auto Ads initialization error:", error);
              }
            }
          }}
        />
      )}
    </>
  );
};
