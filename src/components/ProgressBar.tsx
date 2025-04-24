"use client";

import * as React from "react";

type Props = {
  step: number;
  total: number;
};

export default function ProgressBar({ step, total }: Props) {
  const percent = (step / total) * 100;

  return (
    <div className="w-full mb-6">
      <div className="mb-2 text-center text-sm text-gray-600">
        {step} / {total} 진행 중
      </div>
      <div className="w-full h-3 bg-gray-200 rounded-full">
        <div
          className="h-full bg-purple-500 rounded-full transition-all"
          style={{ width: `${percent}%` }}
        ></div>
      </div>
    </div>
  );
}
