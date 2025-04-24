"use client";

import * as React from "react";
import { useState } from "react";

export function ResultActions() {
  const [email, setEmail] = useState("");
  const [isValid, setIsValid] = useState(false);

  const validateEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsValid(validateEmail(value));
  };

  const handleSubmit = () => {
    if (!isValid) return;
    alert(`리포트가 ${email}로 발송되었습니다!`);
  };

  return (
    <div className="w-full flex flex-col gap-4 mt-10">
      <button
        onClick={() => (window.location.href = "/quiz/q1")}
        className="w-full bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded-xl"
      >
        🔄 다시 테스트하기
      </button>

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

      <button
        onClick={handleSubmit}
        disabled={!isValid}
        className={`w-full text-white font-semibold py-3 rounded-xl transition ${
          isValid
            ? "bg-purple-500 hover:bg-purple-600"
            : "bg-gray-300 text-gray-500 cursor-not-allowed"
        }`}
      >
        📩 자세한 리포트 이메일로 받기
      </button>
    </div>
  );
}
