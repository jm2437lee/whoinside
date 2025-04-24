"use client";

import QPage from "@/components/QPage";
import { notFound, useParams } from "next/navigation";
import ProgressBar from "@/components/ProgressBar";

export default function QuizPage() {
  const params = useParams();
  const qKey = (params.id as string).toUpperCase(); // 예: q1 → Q1

  if (!/^Q[1-9]$|^Q10$/.test(qKey)) {
    return notFound(); // Q1~Q10 외 잘못된 접근 시 404
  }

  const currentStep = parseInt(qKey.replace("Q", ""));

  return (
    <div className="px-4 py-6 max-w-xl mx-auto">
      <ProgressBar step={currentStep} total={10} />
      <QPage questionKey={qKey} />
    </div>
  );
}
