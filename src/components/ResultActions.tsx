"use client";

import * as React from "react";
import { useState } from "react";

interface ResultActionsProps {
  uuid: string | null;
  type: string | null;
  nickname: string | null;
}

export function ResultActions({ uuid, type, nickname }: ResultActionsProps) {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSubmit = async () => {
    if (!isValid || !isAgreed || isSending || !uuid || !type || !nickname)
      return;

    try {
      setIsSending(true);

      const response = await fetch("/api/user", {
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "저장에 실패했습니다.");
      }

      alert(`이메일이 저장 되었습니다!`);
    } catch (error) {
      console.error("Error:", error);
      alert("리포트 발송에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-10">
      <button
        onClick={() => (window.location.href = "/quiz/q1")}
        className="w-full bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded-xl"
      >
        🔄 다시 테스트하기
      </button>

      <div className="space-y-4 bg-purple-50 p-6 rounded-xl">
        <h3 className="text-lg font-semibold text-purple-700">
          📩 자세한 리포트 받아보기
        </h3>

        <input
          type="email"
          value={email}
          onChange={handleChange}
          placeholder="이메일 주소를 입력하세요"
          className={`w-full px-4 py-3 text-lg rounded-xl border transition focus:outline-none focus:ring-2 ${
            email === ""
              ? "border-gray-300"
              : isValid
              ? "border-green-500 focus:ring-green-400"
              : "border-red-500 focus:ring-red-400"
          }`}
        />

        <div className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            id="privacy-agreement"
            checked={isAgreed}
            onChange={(e) => setIsAgreed(e.target.checked)}
            className="mt-1"
          />
          <label
            htmlFor="privacy-agreement"
            className="text-gray-600 leading-relaxed"
          >
            <span className="text-purple-600">[필수] </span>
            이메일 수집 및 발송에 동의합니다.
            <br />
            수집된 이메일은 리포트 발송 목적으로만 사용되며, 발송 후 즉시
            폐기됩니다.
            <br />
            상세 내용은{" "}
            <a
              href="/privacy"
              className="text-purple-600 underline hover:text-purple-700"
            >
              개인정보처리방침
            </a>
            을 참고해주세요.
          </label>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!isValid || !isAgreed || isSending}
          className={`w-full text-white font-semibold py-3 rounded-xl transition ${
            isValid && isAgreed && !isSending
              ? "bg-purple-500 hover:bg-purple-600"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isSending ? "발송 중..." : "리포트 받기"}
        </button>
      </div>
    </div>
  );
}
