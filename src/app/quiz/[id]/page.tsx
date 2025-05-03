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
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white px-4 py-12">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8">
          <div className="space-y-4">
            <h1 className="text-center text-purple-900/80 text-lg font-medium">
              Question {currentStep} of 10
            </h1>
            <ProgressBar step={currentStep} total={10} />
          </div>
          <QPage questionKey={qKey} />
        </div>
      </div>
    </div>
  );
}
