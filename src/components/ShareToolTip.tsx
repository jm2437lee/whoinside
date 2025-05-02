"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function ShareToolTip() {
  const searchParams = useSearchParams();
  const fromNickname = searchParams.get("nickname");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (fromNickname) {
      setIsVisible(true);
    }
  }, [fromNickname]);

  if (!fromNickname || !isVisible) return null;

  return (
    <div className="absolute w-full flex justify-center top-3 z-50">
      <div
        className={`
          bg-purple-600/90 text-white px-5 py-2 rounded-full
          shadow-lg text-sm font-medium
          animate-fade-in backdrop-blur-sm
        `}
      >
        <span className="font-bold">{fromNickname}</span>님이 공유해주셨어요 ✨
      </div>
    </div>
  );
}
