"use client";

import * as React from "react";
import { motion } from "framer-motion";

type Props = {
  step: number;
  total: number;
};

export default function ProgressBar({ step, total }: Props) {
  const percentage = (step / total) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full"
        />
      </div>
      <div className="flex justify-between text-sm text-purple-600">
        <span>
          {step} / {total}
        </span>
        <span>{Math.round(percentage)}%</span>
      </div>
    </div>
  );
}
