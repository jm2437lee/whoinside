"use client";

import * as React from "react";
import { useState } from "react";
import Link from "next/link";

interface ResultActionsProps {
  uuid: string | null;
  type: string;
  nickname: string;
}

export function ResultActions({ uuid, type, nickname }: ResultActionsProps) {
  const [email, setEmail] = useState("");
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);

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

      if (!userResponse.ok) {
        throw new Error("사용자 정보 저장에 실패했습니다.");
      }

      alert("이메일 주소가 저장되었습니다!");
    } catch (error) {
      console.error("Error:", error);
      alert("처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <input
          type="email"
          placeholder="이메일 주소를 입력해주세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />

        <div className="flex items-start gap-2 mt-4">
          <input
            type="checkbox"
            id="privacy"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-1"
          />
          <div className="space-y-1">
            <label
              htmlFor="privacy"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              [필수] 개인정보 수집 및 이용에 동의합니다.
            </label>
            <p className="text-xs text-gray-500 mt-2">
              <a
                href="/privacy"
                target="_blank"
                className="underline hover:text-gray-700"
              >
                개인정보처리방침
              </a>
              에 동의하고 이메일을 입력합니다.
            </p>
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
        {isSending ? "저장 중..." : "궁합 결과 페이지 받아보기"}
      </button>
    </div>
  );
}
