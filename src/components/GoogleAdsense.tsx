"use client";

import { useEffect } from "react";
import Script from "next/script";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export const GoogleAdsense = () => {
  useEffect(() => {
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

  return (
    <>
      <Script
        src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8283413819468215"
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      {/* <div className="w-full my-4 flex justify-center">
        <ins
          className="adsbygoogle"
          style={{ display: "block", minHeight: "250px", width: "100%" }}
          data-ad-client="ca-pub-8283413819468215"
          data-ad-slot="9339664314"
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      </div> */}
    </>
  );
};
