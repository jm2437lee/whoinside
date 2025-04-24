// lib/useQuestion.ts

import questions from "@/data/questions.json";

export function getRandomQuestionByKey(key: string) {
  const pool = questions[key as keyof typeof questions];
  if (!pool || pool.length === 0) return null;
  const index = Math.floor(Math.random() * pool.length);
  return pool[index];
}

export function handleChoice(questionKey: string, choiceType: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem(questionKey, choiceType);
    const current = parseInt(questionKey.replace("Q", ""));
    const nextPage = current === 10 ? "/result" : `/quiz/q${current + 1}`;
    window.location.href = nextPage;
  }
}
