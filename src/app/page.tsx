"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { Suspense } from "react";
import { SearchParamsHandler } from "@/components/SearchParamsHandler";
import React from "react";
import { ShareToolTip } from "@/components/ShareToolTip";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <div className="relative min-h-screen overflow-hidden">
      <Suspense>
        <SearchParamsHandler />
        <ShareToolTip />
      </Suspense>

      {/* 배경 효과 */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        </motion.div>
      </div>

      <main className="relative container mx-auto px-4 py-16 flex flex-col items-center justify-center min-h-screen text-center">
        <div className="max-w-3xl mx-auto space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-4xl md:text-6xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-900"
            >
              감정 성향 테스트
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-lg md:text-xl text-purple-700 mt-4"
            >
              <span className="text-green-700 block">
                나는 왜 이렇게 휘둘릴까?
              </span>
              <br />
              10가지 질문으로 알아보는 당신의 감정 성향
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.6 }}
            className="relative w-full max-w-md mx-auto"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-purple-50 rounded-2xl transform rotate-6 scale-105"></div>
            <div className="relative bg-white rounded-2xl shadow-xl overflow-hidden">
              <motion.div
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ delay: 1.2, duration: 0.6 }}
                className="relative aspect-[4/3] overflow-hidden"
              >
                <Image
                  src="/main.png"
                  alt="감정 성향 테스트 메인 이미지"
                  fill
                  className="object-cover transform hover:scale-105 transition-transform duration-700"
                  priority
                />
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="space-y-8"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block"
            >
              <Button
                asChild
                size="lg"
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 text-lg rounded-xl
                transition-all duration-300
                animate-attention
                relative overflow-hidden
                group"
              >
                <Link href="/quiz/q1" className="flex items-center gap-2">
                  테스트 시작하기
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="transform transition-transform group-hover:translate-x-1"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </motion.svg>
                </Link>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.8, duration: 0.6 }}
              className="text-sm text-purple-500 space-y-1"
            >
              <p>간단한 10가지 질문으로 당신의 감정 성향을 알아보세요.</p>
              <p>소요 시간: 약 3분</p>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
