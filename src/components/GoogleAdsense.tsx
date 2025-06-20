"use client";

import Script from "next/script";

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
        />
      )}
    </>
  );
};
