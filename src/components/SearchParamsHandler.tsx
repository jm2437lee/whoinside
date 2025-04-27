"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export function SearchParamsHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const from = searchParams.get("from");
    const type = searchParams.get("type");
    const nickname = searchParams.get("nickname");

    if (from && type && nickname) {
      localStorage.setItem("from", from);
      localStorage.setItem("fromType", type);
      localStorage.setItem("fromNickname", nickname);
    }
  }, [searchParams]);

  return null; // 아무것도 렌더링 안 해
}
