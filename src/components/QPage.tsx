"use client";

import * as React from "react";
import { getRandomQuestionByKey, handleChoice } from "@/app/lib/useQuestion";
import { motion } from "framer-motion";

type Props = {
  questionKey: string;
};

export default function QPage({ questionKey }: Props) {
  const [questionData, setQuestionData] = React.useState<any>(null);
  const [selectedOption, setSelectedOption] = React.useState<number | null>(
    null
  );

  React.useEffect(() => {
    const selected = getRandomQuestionByKey(questionKey);
    setQuestionData(selected);
    setSelectedOption(null);
  }, [questionKey]);

  if (!questionData) {
    return (
      <div className="flex items-center justify-center min-h-[300px]">
        <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const handleOptionClick = (index: number, type: string) => {
    setSelectedOption(index);
    setTimeout(() => {
      handleChoice(questionKey, type);
    }, 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <h2 className="text-2xl md:text-3xl font-bold text-purple-900 leading-relaxed">
        {questionData.question}
      </h2>
      <div className="space-y-4">
        {questionData.options.map((option: any, i: number) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: i * 0.1 }}
          >
            <button
              onClick={() => handleOptionClick(i, option.type)}
              disabled={selectedOption !== null}
              className={`w-full text-left cursor-pointer p-4 rounded-xl transition-all duration-300
                ${
                  selectedOption === i
                    ? "bg-purple-600 text-white transform scale-[1.02]"
                    : "bg-purple-100 hover:bg-purple-200 hover:shadow-md hover:scale-[1.01]"
                }
                ${
                  selectedOption !== null && selectedOption !== i
                    ? "opacity-50"
                    : ""
                }
                disabled:cursor-not-allowed
                text-lg font-medium`}
            >
              <div className="flex items-center gap-4">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-semibold">
                  {String.fromCharCode(65 + i)}
                </span>
                <span
                  className={
                    selectedOption === i ? "text-white" : "text-purple-900"
                  }
                >
                  {option.text}
                </span>
              </div>
            </button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
