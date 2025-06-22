"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Users, Brain, User, CreditCard } from "lucide-react";
import Link from "next/link";
import typeDescriptions from "@/data/typeDescriptions.json";

interface PreviewPageProps {
  params: Promise<{
    type: string;
  }>;
}

export default function PreviewPage({ params }: PreviewPageProps) {
  const { type } = React.use(params);
  const typeData =
    typeDescriptions[type.toUpperCase() as keyof typeof typeDescriptions];

  if (!typeData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            잘못된 접근입니다
          </h1>
          <Link href="/" className="text-purple-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  const { preview, nickname, title } = typeData;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* 헤더 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link
            href="/"
            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
          >
            <ArrowLeft size={24} className="text-purple-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {nickname} 심화 리포트 미리보기
            </h1>
          </div>
        </motion.div>

        {/* 프리뷰 섹션들 */}
        <div className="space-y-8">
          {/* 성향 상세 해석 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-indigo-100 rounded-full">
                <Brain size={24} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  🧠 성향 상세 해석
                </h2>
                <p className="text-gray-600 text-sm">
                  나는 어떤 감정 패턴을 가지고 있을까?
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-6">
              <div className="space-y-4">
                <div className="bg-white/70 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-bold text-gray-800 mb-2">기본 성향</h3>
                  <p className="text-gray-700 leading-relaxed">
                    {typeData.description.substring(0, 150)}...
                  </p>
                </div>

                <div className="bg-white/70 rounded-lg p-4 backdrop-blur-sm">
                  <h3 className="font-bold text-gray-800 mb-2">
                    감정 표현 스타일
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {typeData.freeReport?.emotionalStyle}
                  </p>
                </div>
              </div>

              {/* 블러 처리된 추가 내용 */}
              <div className="relative mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-dashed border-indigo-300">
                  <div className="text-center text-indigo-600 font-medium">
                    <Brain size={20} className="inline mr-2" />더 깊이 있는 성향
                    분석과 심리적 배경은 풀버전에서 확인하세요
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 궁합 분석 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-pink-100 rounded-full">
                <Heart size={24} className="text-pink-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  💞 유형별 궁합 분석
                </h2>
                <p className="text-gray-600 text-sm">
                  나와 잘 맞는 사람은 누구일까?
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2">
                    ✅ 최고 궁합
                  </h3>
                  <p className="text-green-700 font-medium">
                    {preview.matchType.best}
                  </p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                  <h3 className="font-semibold text-red-800 mb-2">
                    ⚠️ 주의 궁합
                  </h3>
                  <p className="text-red-700 font-medium">
                    {preview.matchType.worst}
                  </p>
                </div>
              </div>
              <p className="text-gray-700 mt-4 leading-relaxed">
                {preview.matchType.description}
              </p>

              {/* 블러 처리된 추가 내용 */}
              <div className="relative mt-6">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-dashed border-purple-300">
                  <div className="text-center text-purple-600 font-medium">
                    <Users size={20} className="inline mr-2" />
                    8개 유형 전부와의 궁합 분석은 풀버전에서 확인 가능
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 갈등 대응 전략 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-orange-100 rounded-full">
                <Brain size={24} className="text-orange-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  🛠️ 갈등 대응 전략
                </h2>
                <p className="text-gray-600 text-sm">
                  왜 관계에서 자꾸 상처받을까?
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">
                {preview.conflict.title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {preview.conflict.description}
              </p>

              {/* 블러 처리된 추가 내용 */}
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-dashed border-orange-300">
                  <div className="text-center text-orange-600 font-medium">
                    <Brain size={20} className="inline mr-2" />
                    구체적인 갈등 해결 전략과 대화법은 풀버전에서 확인하세요
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 감정 관리 루틴 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-full">
                <User size={24} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  🧘 감정 관리 루틴
                </h2>
                <p className="text-gray-600 text-sm">
                  감정을 조절하는 내 방식, 괜찮은 걸까?
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">
                {preview.management.title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {preview.management.description}
              </p>

              {/* 블러 처리된 추가 내용 */}
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-dashed border-blue-300">
                  <div className="text-center text-blue-600 font-medium">
                    <User size={20} className="inline mr-2" />
                    개인 맞춤형 감정 관리 루틴과 실천법은 풀버전에서 확인하세요
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 페르소나 매칭 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-2xl p-8 shadow-lg border border-purple-100"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-purple-100 rounded-full">
                <Users size={24} className="text-purple-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">
                  🧩 실제 사례 페르소나 매칭
                </h2>
                <p className="text-gray-600 text-sm">
                  나와 닮은 인물은 누구일까?
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6">
              <h3 className="font-bold text-gray-800 mb-3">
                {preview.persona.title}
              </h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                {preview.persona.description}
              </p>

              {/* 블러 처리된 추가 내용 */}
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border-2 border-dashed border-purple-300">
                  <div className="text-center text-purple-600 font-medium">
                    <Users size={20} className="inline mr-2" />더 많은 페르소나
                    분석과 실제 사례는 풀버전에서 확인하세요
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* 결제 CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center"
        >
          <h2 className="text-2xl font-bold mb-4">
            나만의 완전한 감정 성향 리포트를 받아보세요
          </h2>
          <p className="text-indigo-100 mb-6 leading-relaxed">
            5페이지 분량의 상세 분석 리포트로
            <br />
            진짜 나를 이해하고 더 나은 관계를 만들어보세요
          </p>

          <div className="bg-white/10 rounded-xl p-6 mb-6">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>8가지 유형별 상세 궁합 분석</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>구체적인 갈등 해결 전략</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>개인 맞춤형 감정 관리 루틴</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-300">✓</span>
                <span>실제 사례 페르소나 매칭</span>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-indigo-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
          >
            <CreditCard size={20} />
            <span>완전한 리포트 받기 (1,000원)</span>
          </motion.button>

          <p className="text-indigo-200 text-sm mt-4">
            💝 런칭 기념 특가! 정가 2,000원 → 1,000원 (50% 할인)
          </p>
        </motion.div>
      </div>
    </div>
  );
}
