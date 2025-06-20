"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";

interface ResultActionsProps {
  uuid: string | null;
  type: string;
  nickname: string;
}

export function ResultActions({ uuid, type, nickname }: ResultActionsProps) {
  const [email, setEmail] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [resultUrl, setResultUrl] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleSubmit = async () => {
    if (!validateEmail(email) || !isAgreed || isSending || !uuid || !type)
      return;

    try {
      setIsSending(true);

      // 1. 사용자 정보 저장
      const userResponse = await fetch("/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uuid,
          email,
          type,
          nickname,
        }),
      });

      const data = await userResponse.json();

      if (!userResponse.ok) {
        alert(data.message || "사용자 정보 저장에 실패했습니다.");
        return;
      }

      // 성공 상태로 변경하고 결과 URL 저장
      setIsSuccess(true);
      if (data.resultUrl) {
        setResultUrl(data.resultUrl);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  // 성공 시 마이페이지 이동 UI 표시
  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <div className="text-green-600 text-lg font-semibold mb-2">
            ✅ 이메일이 성공적으로 저장되었습니다!
          </div>
          <p className="text-green-700 text-sm mb-4">
            결과 페이지 링크가 이메일로 발송되었습니다.
            <br />
            (스팸함도 확인해주세요!)
          </p>
          {resultUrl && (
            <Link href={resultUrl}>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 rounded-xl transition-colors"
              >
                📄 마이페이지로 바로가기
              </motion.button>
            </Link>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="relative">
          <input
            type="email"
            placeholder="이메일 입력 후 리포트 즉시 받기"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 pr-[120px]"
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="sr-only"
              />
              <div
                className={`w-4 h-4 border rounded ${
                  isAgreed
                    ? "bg-purple-500 border-purple-500"
                    : "border-gray-300"
                } flex items-center justify-center`}
              >
                {isAgreed && <span className="text-white text-xs">✓</span>}
              </div>
              <span className="ml-1 text-xs text-gray-600">
                <a
                  href="/privacy"
                  target="_blank"
                  className="underline hover:text-purple-600"
                >
                  개인정보 동의
                </a>
              </span>
            </label>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!validateEmail(email) || !isAgreed || isSending}
        className={`w-full text-white font-semibold py-3 rounded-xl transition ${
          validateEmail(email) && isAgreed && !isSending
            ? "bg-purple-500 hover:bg-purple-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        {isSending ? "처리 중..." : "특별 리포트 받기"}
      </button>
    </div>
  );
}
