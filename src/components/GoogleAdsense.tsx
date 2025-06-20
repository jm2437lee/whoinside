"use client";

import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface GoogleAdsenseProps {
  loadScript?: boolean;
}

export const GoogleAdsense = ({ loadScript = false }: GoogleAdsenseProps) => {
  return (
    <>
      {loadScript && (
        <>
          <Script
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8283413819468215"
            strategy="afterInteractive"
            crossOrigin="anonymous"
            onLoad={() => {
              // 스크립트 로드 완료 후 Auto Ads 초기화
              try {
                (window.adsbygoogle = window.adsbygoogle || []).push({});
              } catch (error) {
                console.error("Auto Ads initialization error:", error);
              }
            }}
          />
          {/* 추가 초기화를 위한 인라인 스크립트 */}
          <Script id="adsense-init" strategy="afterInteractive">
            {`
              (function() {
                if (typeof window !== 'undefined') {
                  window.adsbygoogle = window.adsbygoogle || [];
                  window.adsbygoogle.push({});
                }
              })();
            `}
          </Script>
        </>
      )}
    </>
  );
};
