"use client";

import * as React from "react";
import { getRandomQuestionByKey, handleChoice } from "@/app/lib/useQuestion";

type Props = {
  questionKey: string;
};

export default function QPage({ questionKey }: Props) {
  const [questionData, setQuestionData] = React.useState<any>(null);

  React.useEffect(() => {
    const selected = getRandomQuestionByKey(questionKey);
    setQuestionData(selected);
  }, [questionKey]);

  if (!questionData) return <div className="text-center">로딩 중...</div>;

  return (
    <div className="text-center space-y-6">
      <h2 className="text-2xl font-semibold">{questionData.question}</h2>
      <div className="space-y-4">
        {questionData.options.map((option: any, i: number) => (
          <div
            key={i}
            onClick={() => handleChoice(questionKey, option.type)}
            className="cursor-pointer bg-purple-100 hover:bg-purple-200 text-lg py-3 px-4 rounded-xl transition"
          >
            {option.text}
          </div>
        ))}
      </div>
    </div>
  );
}
