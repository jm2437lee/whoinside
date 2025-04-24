"use client";

import * as React from "react";
import { calculateResult } from "@/app/lib/calculateResult";
import { ResultActions } from "@/components/ResultActions";

const reactionGifs: Record<string, { img: string; quote: string }> = {
  A1: {
    img: "/gifs/a1.gif",
    quote: "감정은 사소해도 치명적... 머릿속에서 떠나지 않아🥺",
  },
  A2: {
    img: "/gifs/a2.gif",
    quote: "혼자 조용히 넘기려 했지만... 마음속 파도는 여전해🌊",
  },
  B1: {
    img: "/gifs/b1.gif",
    quote: "감정이 복잡할 땐 거리두기! 피하면 편해요✌️",
  },
  B2: {
    img: "/gifs/b2.gif",
    quote: "갈등은 끊어내는 게 제일 깔끔하죠🔪",
  },
  C1: {
    img: "/gifs/c1.gif",
    quote: "감정보다 이성이 먼저! 공감보다 논리🧠",
  },
  C2: {
    img: "/gifs/c2.gif",
    quote: "쿨한 무심함. 감정? 신경 안 씀😎",
  },
  D1: {
    img: "/gifs/d1.gif",
    quote: "말 안 하면 터져요! 지금 바로 표현하는 편🔥",
  },
  D2: {
    img: "/gifs/d2.gif",
    quote: "참다가 폭발! 그동안 쌓인 감정이 퐁!💥",
  },
};

export default function ResultPage() {
  const [result, setResult] = React.useState<any>(null);

  React.useEffect(() => {
    const answers: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const value = localStorage.getItem(`Q${i}`);
      if (value) answers.push(value);
    }
    if (answers.length === 10) {
      const { type, title, description, tmi } = calculateResult(answers);

      setResult({
        type,
        title,
        description,
        tmi,
      });
    }
  }, []);

  if (!result)
    return <div className="text-center py-20">결과를 불러오는 중...</div>;

  const reaction = reactionGifs[result.type];

  return (
    <div className="min-h-screen flex flex-col justify-center items-center px-6 py-10">
      <div className="max-w-xl w-full space-y-6">
        <h1 className="text-3xl font-bold text-center">
          당신의 감정 성향은: {result.title} ({result.type})
        </h1>
        <p className="text-gray-700 text-lg text-center">
          {result.description}
        </p>
        <p className="mt-4 text-purple-600 italic">{result.tmi}</p>

        {reaction && (
          <div className="flex flex-col items-center gap-4">
            <img
              src={reaction.img}
              alt="성향 반응 이미지"
              className="w-full max-w-xs rounded-xl shadow-md"
            />
            <p className="text-center text-purple-700 font-semibold">
              {reaction.quote}
            </p>
          </div>
        )}

        <ResultActions />
      </div>
    </div>
  );
}
