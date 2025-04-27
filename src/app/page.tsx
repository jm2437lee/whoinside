"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";

function SearchParamsHandler() {
  const searchParams = useSearchParams();

  // 여기서 localStorage 저장 로직 작성
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

  return null; // 렌더링 안 해도 됨
}

export default function LandingPage() {
  // const searchParams = useSearchParams();

  // useEffect(() => {
  //   const from = searchParams.get("from");
  //   const type = searchParams.get("type");
  //   const nickname = searchParams.get("nickname");

  //   if (from && type && nickname) {
  //     localStorage.setItem("fromUuid", from);
  //     localStorage.setItem("fromType", type);
  //     localStorage.setItem("fromNickname", decodeURIComponent(nickname));
  //   }
  // }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
        {/* 여기 추가 */}
        <Suspense fallback={null}>
          <SearchParamsHandler />
        </Suspense>
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-purple-900">
              감정 성향 테스트
            </h1>
            <p className="text-lg md:text-xl text-purple-700 mt-4">
              10가지 질문으로 알아보는 당신의 감정 성향
            </p>
          </div>

          <div className="relative w-full max-w-md mx-auto h-64 md:h-80 bg-purple-100 rounded-2xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200/80 to-purple-300/50"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-purple-200 flex items-center justify-center">
                <div className="w-16 h-16 md:w-24 md:h-24 rounded-full bg-purple-300 flex items-center justify-center">
                  <div className="w-8 h-8 md:w-12 md:h-12 rounded-full bg-purple-400"></div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-6">
            <Button
              asChild
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-300/50"
            >
              <Link href="/quiz/q1">테스트 시작하기</Link>
            </Button>
          </div>

          <div className="pt-8 text-sm text-purple-500">
            <p>간단한 10가지 질문으로 당신의 감정 성향을 알아보세요.</p>
            <p>소요 시간: 약 3분</p>
          </div>
        </div>
      </main>
    </div>
  );
}
