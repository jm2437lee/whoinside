"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

interface AdSlotProps {
  slot: string;
  format?: string;
  style?: React.CSSProperties;
}

export const AdSlot = ({
  slot,
  format = "auto",
  style = { display: "block", minHeight: "250px", width: "100%" },
}: AdSlotProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // 개발 환경에서는 초기화하지 않음
    if (process.env.NODE_ENV === "development") {
      return;
    }

    // 이미 초기화되었으면 건너뛰기
    if (hasInitialized.current) {
      return;
    }

    const initializeAd = () => {
      try {
        if (
          typeof window !== "undefined" &&
          window.adsbygoogle &&
          adRef.current &&
          !hasInitialized.current
        ) {
          // 이미 초기화된 광고인지 확인
          if (adRef.current.getAttribute("data-adsbygoogle-status")) {
            return;
          }

          (window.adsbygoogle = window.adsbygoogle || []).push({});
          hasInitialized.current = true;
        }
      } catch (error) {
        console.error("AdSlot initialization error:", error);
      }
    };

    // 스크립트 로드 후 초기화
    const timer = setTimeout(initializeAd, 2000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  // 개발 환경에서는 플레이스홀더 표시
  if (process.env.NODE_ENV === "development") {
    return (
      <div className="w-full my-4 flex justify-center">
        <div
          className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-gray-500 text-sm"
          style={style}
        >
          [AdSense 광고 슬롯: {slot}]
        </div>
      </div>
    );
  }

  return (
    <div className="w-full my-4 flex justify-center">
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={style}
        data-ad-client="ca-pub-8283413819468215"
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
};
