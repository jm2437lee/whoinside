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
              <Link
                href="/"
                className="p-2 hover:bg-white/50 rounded-lg transition-colors"
              >
                <ArrowLeft size={24} className="text-purple-600" />
              </Link>
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
          <div className="text-center mb-16 print:mb-12 page-break-after">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4 print:text-3xl">
                감정 성향 심화 리포트
              </h1>
              <h2 className="text-2xl text-purple-600 font-semibold print:text-xl">
                {nickname}
              </h2>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-8 print:p-6 print:border print:border-gray-200">
              <div className="grid md:grid-cols-2 gap-6 text-left">
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 mb-3">
                    📋 리포트 구성
                  </h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>• 성향 상세 해석</div>
                    <div>• 유형별 궁합 분석</div>
                    <div>• 갈등 대응 전략</div>
                    <div>• 감정 관리 루틴</div>
                    <div>• 실제 사례 페르소나 매칭</div>
                    <div>• 최종 정리</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <h3 className="font-bold text-gray-800 mb-3">💡 활용 방법</h3>
                  <div className="space-y-2 text-sm text-gray-700">
                    <div>• 자기 이해와 성찰의 도구</div>
                    <div>• 관계 개선 가이드</div>
                    <div>• 감정 관리 실천 매뉴얼</div>
                    <div>• 일상 속 감정 코칭</div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm mt-8 print:mt-6">
              생성일: {currentDate}
            </p>
          </div>

          {/* 각 섹션 */}
          {reportData.map((section, index) => {
            const Icon = getSectionIcon(index);
            const colorClass = getSectionColor(index);
            const iconColorClass = getSectionIconColor(index);

            return (
              <div key={index} className="mb-16 print:mb-12 page-break-before">
                {/* 섹션 헤더 */}
                <div className="flex items-center gap-4 mb-8 print:mb-6">
                  <div className={`p-3 rounded-full ${iconColorClass}`}>
                    <Icon size={24} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-800 print:text-xl">
                      {section.section}
                    </h2>
                    <p className="text-gray-600 print:text-sm">
                      {section.summary}
                    </p>
                  </div>
                </div>

                {/* 섹션 콘텐츠 */}
                <div
                  className={`bg-gradient-to-br ${colorClass} rounded-2xl p-8 print:p-6 print:border print:border-gray-200`}
                >
                  {/* P1: 성향 상세 해석 */}
                  {index === 0 && (
                    <div className="space-y-6">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/70 rounded-lg p-6 print:p-4"
                        >
                          <h3 className="font-bold text-gray-800 mb-3 print:text-sm">
                            {item.title}
                          </h3>
                          <p className="text-gray-700 leading-relaxed print:text-sm">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P2: 유형별 궁합 분석 */}
                  {index === 1 && (
                    <div className="space-y-4">
                      {section.content.map((match: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/70 rounded-lg p-4 print:p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-gray-800 print:text-sm">
                              {match.matchNickname}
                            </h3>
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                match.matchLevel === "최고 궁합"
                                  ? "bg-green-100 text-green-800"
                                  : match.matchLevel === "보완 궁합"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {match.matchLevel}
                            </span>
                          </div>
                          <p className="text-gray-700 text-sm leading-relaxed print:text-xs">
                            {match.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P3: 갈등 대응 전략 */}
                  {index === 2 && (
                    <div className="space-y-6">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/70 rounded-lg p-6 print:p-4"
                        >
                          <h3 className="font-bold text-gray-800 mb-3 print:text-sm">
                            {item.situation}
                          </h3>
                          <p className="text-gray-700 leading-relaxed print:text-sm">
                            {item.strategy}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P4: 감정 관리 루틴 */}
                  {index === 3 && (
                    <div className="space-y-6">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/70 rounded-lg p-6 print:p-4"
                        >
                          <h3 className="font-bold text-gray-800 mb-3 print:text-sm">
                            {item.routine}
                          </h3>
                          <p className="text-gray-700 leading-relaxed print:text-sm">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P5: 실제 사례 페르소나 매칭 */}
                  {index === 4 && (
                    <div className="space-y-6">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/70 rounded-lg p-6 print:p-4"
                        >
                          <h3 className="font-bold text-gray-800 mb-3 print:text-sm">
                            {item.persona}
                          </h3>
                          <p className="text-gray-700 leading-relaxed print:text-sm">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P6: 최종 정리 */}
                  {index === 5 && (
                    <div className="space-y-4">
                      {section.content.map((item: string, idx: number) => (
                        <div
                          key={idx}
                          className="bg-white/70 rounded-lg p-4 print:p-3"
                        >
                          <p className="text-gray-700 leading-relaxed print:text-sm">
                            {item}
                          </p>
                        </div>
                      ))}
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
          <div className="text-center mt-16 print:mt-12 pt-8 print:pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              이 리포트는 개인의 감정 성향을 이해하고 관계 개선에 도움을 주기
              위해 제작되었습니다.
            </p>
            <p className="text-gray-400 text-xs mt-2 print:hidden">
              © 2024 감정성향테스트. All rights reserved.
            </p>
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
