"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";
import { SearchParamsHandler } from "@/components/SearchParamsHandler";
import React from "react";

export default function LandingPage() {
  // 카카오 SDK 초기화를 위한 useEffect 추가
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("47e9e842805216474700f75e72891072");
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <>
      <Suspense>
        <SearchParamsHandler />
      </Suspense>
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
        <main className="container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
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
    </>
  );
}
