"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function LocalStorageInitializer() {
  const pathname = usePathname();

  useEffect(() => {
    // 첫 진입 페이지(홈)에서만 초기화 실행
    if (pathname === "/") {
      // URL 파라미터 체크
      const params = new URLSearchParams(window.location.search);
      const from = params.get("from");
      const type = params.get("type");
      const nickname = params.get("nickname");

      // 공유 링크로 들어온 경우가 아니면 로컬스토리지 초기화
      if (!from) {
        localStorage.clear();
      }
      // 공유 링크로 들어온 경우는 공유 파라미터만 저장
      else if (from && type && nickname) {
        localStorage.clear();
        localStorage.setItem("from", from);
        localStorage.setItem("fromType", type);
        localStorage.setItem("fromNickname", nickname);
      }
    }
  }, [pathname]);

  return null;
}
