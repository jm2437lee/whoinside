import typeDescriptions from "@/data/typeDescriptions.json";
import compatibilityDescriptions from "@/data/compatibilityDescriptions.json";

export function calculateResult(answers: string[]): {
  type: string;
  title: string;
  nickname: string;
  description: string;
  tmi: string;
  advice: string[];
} {
  const countMap: Record<string, number> = {};

  for (const answer of answers) {
    countMap[answer] = (countMap[answer] || 0) + 1;
  }

  const finalType = Object.keys(countMap).reduce((a, b) =>
    countMap[a] > countMap[b] ? a : b
  );

  const { title, nickname, description, tmi, advice } =
    typeDescriptions[finalType as keyof typeof typeDescriptions];

  return {
    type: finalType,
    title,
    nickname,
    description,
    tmi,
    advice,
  };
}
