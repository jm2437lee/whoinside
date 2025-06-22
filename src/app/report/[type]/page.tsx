"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Download,
  Brain,
  Heart,
  Users,
  Shield,
  User,
  Star,
} from "lucide-react";
import Link from "next/link";

interface ReportPageProps {
  params: Promise<{
    type: string;
  }>;
}

interface ReportSection {
  type: string;
  nickname: string;
  section: string;
  summary: string;
  content: any[];
  note: string;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { type } = React.use(params);
  const [reportData, setReportData] = React.useState<ReportSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentDate, setCurrentDate] = React.useState<string>("");

  React.useEffect(() => {
    // 현재 날짜 설정 (클라이언트 사이드에서만)
    setCurrentDate(new Date().toLocaleDateString("ko-KR"));

    const loadReportData = async () => {
      try {
        const sections = ["p1", "p2", "p3", "p4", "p5", "p6"];
        const data: ReportSection[] = [];

        for (const section of sections) {
          const response = await fetch(
            `/api/report/${type.toLowerCase()}/${section}`
          );
          if (!response.ok) {
            throw new Error(`Failed to load ${section}`);
          }
          const sectionData = await response.json();
          data.push(sectionData);
        }

        setReportData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    loadReportData();
  }, [type]);

  const handlePrintPDF = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">리포트를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            리포트를 불러올 수 없습니다
          </h1>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link href="/" className="text-purple-600 hover:underline">
            홈으로 돌아가기
          </Link>
        </div>
      </div>
    );
  }

  if (reportData.length === 0) {
    return null;
  }

  const nickname = reportData[0]?.nickname || "";

  const getSectionIcon = (index: number) => {
    const icons = [Brain, Heart, Shield, User, Users, Star];
    const Icon = icons[index] || Brain;
    return Icon;
  };

  const getSectionColor = (index: number) => {
    const colors = [
      "from-indigo-50 to-blue-50",
      "from-pink-50 to-purple-50",
      "from-orange-50 to-red-50",
      "from-blue-50 to-indigo-50",
      "from-purple-50 to-pink-50",
      "from-green-50 to-emerald-50",
    ];
    return colors[index] || colors[0];
  };

  const getSectionIconColor = (index: number) => {
    const colors = [
      "text-indigo-600 bg-indigo-100",
      "text-pink-600 bg-pink-100",
      "text-orange-600 bg-orange-100",
      "text-blue-600 bg-blue-100",
      "text-purple-600 bg-purple-100",
      "text-green-600 bg-green-100",
    ];
    return colors[index] || colors[0];
  };

  return (
    <>
      {/* 화면용 헤더 (프린트시 숨김) */}
      <div className="print:hidden bg-gradient-to-br from-purple-50 to-pink-50 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {nickname} 심화 리포트
                </h1>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrintPDF}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Download size={20} />
              PDF 다운로드
            </motion.button>
          </div>
        </div>
      </div>

      {/* 리포트 콘텐츠 */}
      <div className="bg-white print:bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl print:max-w-none print:px-8">
          {/* 표지 */}
          <div className="text-center mb-16 print:mb-12 page-break-after relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute inset-0 opacity-5 print:hidden">
              <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
              <div className="absolute top-32 right-20 w-24 h-24 bg-pink-300 rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-6 print:hidden">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  PREMIUM REPORT
                </div>
                <h1 className="text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-6 print:text-4xl print:text-gray-800">
                  감정 성향 심화 리포트
                </h1>
                <div className="relative inline-block">
                  <h2 className="text-3xl text-gray-800 font-bold print:text-2xl relative z-10">
                    {nickname}
                  </h2>
                  <div className="absolute -bottom-2 left-0 right-0 h-3 bg-gradient-to-r from-purple-200 to-pink-200 opacity-50 print:hidden"></div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-3xl p-10 print:p-6 print:border print:border-gray-200 shadow-2xl print:shadow-none">
                <div className="grid md:grid-cols-2 gap-8 text-left">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">📋</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        리포트 구성
                      </h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>성향 상세 해석</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-pink-400 rounded-full"></div>
                        <span>유형별 궁합 분석</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span>갈등 대응 전략</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>감정 관리 루틴</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                        <span>실제 사례 페르소나 매칭</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-purple-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span>최종 정리</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm font-bold">💡</span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg">
                        활용 방법
                      </h3>
                    </div>
                    <div className="space-y-3 text-sm text-gray-700">
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-indigo-400 rounded-full"></div>
                        <span>자기 이해와 성찰의 도구</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                        <span>관계 개선 가이드</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                        <span>감정 관리 실천 매뉴얼</span>
                      </div>
                      <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-blue-50 transition-colors print:hover:bg-transparent">
                        <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                        <span>일상 속 감정 코칭</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>생성일: {currentDate}</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 각 섹션 */}
          {reportData.map((section, index) => {
            const Icon = getSectionIcon(index);
            const colorClass = getSectionColor(index);
            const iconColorClass = getSectionIconColor(index);

            return (
              <div key={index} className="mb-16 print:mb-12 page-break-before">
                {/* 섹션 헤더 */}
                <div className="relative mb-12 print:mb-8">
                  <div className="flex items-start gap-6 mb-6">
                    <div
                      className={`p-4 rounded-2xl ${iconColorClass} shadow-lg print:shadow-none relative`}
                    >
                      <Icon size={28} />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md print:hidden">
                        <span className="text-xs font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-3xl font-bold text-gray-800 print:text-2xl">
                          {section.section}
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent print:hidden"></div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-xl border-l-4 border-purple-400 print:border-l-2 print:bg-transparent">
                        <p className="text-gray-700 leading-relaxed print:text-sm italic">
                          {section.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 섹션 콘텐츠 */}
                <div
                  className={`bg-gradient-to-br ${colorClass} rounded-2xl p-8 print:p-6 print:border print:border-gray-200`}
                >
                  {/* P1: 성향 상세 해석 */}
                  {index === 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 print:p-6 shadow-lg hover:shadow-xl transition-all duration-300 print:shadow-none border border-white/20 hover:border-purple-200 print:border-gray-200"
                        >
                          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm print:hidden">
                            {idx + 1}
                          </div>
                          <div className="mb-4">
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-4 print:hidden"></div>
                            <h3 className="font-bold text-gray-800 mb-4 text-lg print:text-base leading-tight">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-gray-700 leading-relaxed print:text-sm">
                            {item.description}
                          </p>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity print:hidden"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P2: 유형별 궁합 분석 */}
                  {index === 1 && (
                    <div className="space-y-6">
                      {section.content.map((match: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 print:p-4 shadow-lg hover:shadow-xl transition-all duration-300 print:shadow-none border border-white/20 hover:border-pink-200 print:border-gray-200"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  match.matchLevel === "최고 궁합"
                                    ? "bg-green-400"
                                    : match.matchLevel === "보완 궁합"
                                    ? "bg-yellow-400"
                                    : "bg-red-400"
                                }`}
                              ></div>
                              <h3 className="font-bold text-gray-800 text-lg print:text-base">
                                {match.matchNickname}
                              </h3>
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-4 py-2 rounded-full text-xs font-bold shadow-sm ${
                                  match.matchLevel === "최고 궁합"
                                    ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                                    : match.matchLevel === "보완 궁합"
                                    ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
                                    : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
                                }`}
                              >
                                {match.matchLevel}
                              </span>
                            </div>
                          </div>
                          <div className="pl-6 border-l-2 border-gray-200 print:border-l-1">
                            <p className="text-gray-700 leading-relaxed print:text-sm">
                              {match.description}
                            </p>
                          </div>
                          <div
                            className={`absolute bottom-0 left-0 right-0 h-1 rounded-b-2xl opacity-20 ${
                              match.matchLevel === "최고 궁합"
                                ? "bg-gradient-to-r from-green-300 to-emerald-300"
                                : match.matchLevel === "보완 궁합"
                                ? "bg-gradient-to-r from-yellow-300 to-orange-300"
                                : "bg-gradient-to-r from-red-300 to-pink-300"
                            } print:hidden`}
                          ></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P3: 갈등 대응 전략 */}
                  {index === 2 && (
                    <div className="space-y-8">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 print:shadow-none border border-white/20 hover:border-orange-200 print:border-gray-200"
                        >
                          <div className="flex">
                            <div className="w-2 bg-gradient-to-b from-orange-400 to-red-400 print:w-1"></div>
                            <div className="flex-1 p-8 print:p-6">
                              <div className="flex items-start gap-4 mb-6">
                                <div className="w-10 h-10 bg-gradient-to-br from-orange-100 to-red-100 rounded-xl flex items-center justify-center text-orange-600 font-bold text-lg print:w-8 print:h-8 print:text-base">
                                  {idx + 1}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-3">
                                    <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded-full print:hidden">
                                      상황
                                    </span>
                                  </div>
                                  <h3 className="font-bold text-gray-800 text-lg print:text-base leading-tight mb-4">
                                    {item.situation}
                                  </h3>
                                </div>
                              </div>
                              <div className="pl-14 print:pl-10">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-xs font-bold text-blue-600 bg-blue-100 px-2 py-1 rounded-full print:hidden">
                                    해결책
                                  </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed print:text-sm bg-gradient-to-r from-blue-50 to-transparent p-4 rounded-lg print:bg-transparent print:p-0">
                                  {item.strategy}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P4: 감정 관리 루틴 */}
                  {index === 3 && (
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 print:p-4 shadow-lg hover:shadow-xl transition-all duration-300 print:shadow-none border border-white/20 hover:border-blue-200 print:border-gray-200 hover:scale-105 print:hover:scale-100"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-2xl print:hidden"></div>
                          <div className="pt-4">
                            <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-2xl print:w-10 print:h-10 print:text-xl">
                                {item.routine.split(" ")[0]}
                              </div>
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm print:w-6 print:h-6 print:text-xs">
                                {idx + 1}
                              </div>
                            </div>
                            <h3 className="font-bold text-gray-800 text-lg print:text-base mb-4 leading-tight">
                              {item.routine}
                            </h3>
                            <p className="text-gray-700 leading-relaxed print:text-sm text-sm">
                              {item.description}
                            </p>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity print:hidden"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P5: 실제 사례 페르소나 매칭 */}
                  {index === 4 && (
                    <div className="space-y-8">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 print:shadow-none border border-white/20 hover:border-purple-200 print:border-gray-200"
                        >
                          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 print:h-1"></div>
                          <div className="p-8 print:p-6">
                            <div className="flex items-start gap-6 mb-6">
                              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-purple-600 font-bold text-2xl print:w-12 print:h-12 print:text-xl border-2 border-purple-200">
                                {idx + 1}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-3">
                                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-3 py-1 rounded-full print:hidden">
                                    캐릭터
                                  </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-xl print:text-lg mb-2 leading-tight">
                                  {item.persona}
                                </h3>
                              </div>
                            </div>
                            <div className="pl-22 print:pl-16">
                              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 p-6 print:p-4 rounded-xl border-l-4 border-purple-300 print:border-l-2">
                                <p className="text-gray-700 leading-relaxed print:text-sm">
                                  {item.description}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 opacity-20 print:hidden"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P6: 최종 정리 */}
                  {index === 5 && (
                    <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-3xl p-10 print:p-8 print:bg-transparent print:border print:border-gray-200">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full text-sm font-medium text-green-700 mb-4 print:hidden">
                          <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                          KEY INSIGHTS
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 print:text-xl">
                          당신을 위한 핵심 포인트
                        </h3>
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        {section.content.map((item: string, idx: number) => (
                          <div
                            key={idx}
                            className="group relative bg-white/80 backdrop-blur-sm rounded-2xl p-6 print:p-4 shadow-md hover:shadow-lg transition-all duration-300 print:shadow-none border border-green-100 hover:border-green-200 print:border-gray-200"
                          >
                            <div className="flex items-start gap-4">
                              <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 print:w-6 print:h-6 print:text-xs">
                                ✓
                              </div>
                              <p className="text-gray-700 leading-relaxed print:text-sm flex-1">
                                {item.replace("✔ ", "")}
                              </p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity print:hidden"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 섹션 노트 */}
                  {section.note && (
                    <div className="mt-8 print:mt-6 p-6 print:p-4 bg-white/50 rounded-lg border-l-4 border-purple-400">
                      <p className="text-gray-700 italic leading-relaxed print:text-sm">
                        💡 {section.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 푸터 */}
          <div className="relative mt-20 print:mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 rounded-3xl print:hidden"></div>
            <div className="relative text-center py-12 print:py-8 px-8 print:px-4">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-4 py-2 rounded-full text-sm font-medium text-purple-700 mb-4 print:hidden">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  PREMIUM REPORT
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4 print:text-lg">
                  감정 성향 심화 분석 완료
                </h3>
                <p className="text-gray-600 text-sm max-w-2xl mx-auto leading-relaxed print:text-xs">
                  이 리포트는 개인의 감정 성향을 이해하고 관계 개선에 도움을
                  주기 위해 제작되었습니다. 지속적인 자기 성찰과 실천을 통해 더
                  나은 감정 관리와 인간관계를 만들어가세요.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-gray-400 text-xs print:hidden">
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  <span>© 2024 감정성향테스트</span>
                </div>
                <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                <div className="flex items-center gap-2">
                  <span>All rights reserved</span>
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 프린트 스타일 */}
      <style jsx global>{`
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
          }

          .page-break-before {
            page-break-before: always;
          }

          .page-break-after {
            page-break-after: always;
          }

          @page {
            margin: 1in;
            size: A4;
          }

          body {
            font-size: 12pt;
            line-height: 1.4;
          }
        }
      `}</style>
    </>
  );
}
