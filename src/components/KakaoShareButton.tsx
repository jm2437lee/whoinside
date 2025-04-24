// components/KakaoShareButton.tsx
"use client";

import Image from "next/image";

interface KakaoShareButtonProps {
  onClick: () => void;
}

export default function KakaoShareButton({ onClick }: KakaoShareButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 px-4 py-2 bg-black text-yellow-300 rounded-lg shadow hover:brightness-125 transition"
    >
      <Image
        src="/icon_kakao.png"
        alt="카카오톡 아이콘"
        width={40}
        height={40}
        priority
      />
      <span className="font-medium text-sm">내 친구는 나와 잘맞을까?</span>
    </button>
  );
}
