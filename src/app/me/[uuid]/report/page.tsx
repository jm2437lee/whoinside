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
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

interface ReportPageProps {
  params: Promise<{
    uuid: string;
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

interface UserData {
  id: string;
  nickname: string;
  result: string;
  createdAt: string;
  is_paid: number;
}

export default function ReportPage({ params }: ReportPageProps) {
  const { uuid } = React.use(params);
  const [userData, setUserData] = React.useState<UserData | null>(null);
  const [reportData, setReportData] = React.useState<ReportSection[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [currentDate, setCurrentDate] = React.useState<string>("");
  const [userNickname, setUserNickname] = React.useState<string>("");

  React.useEffect(() => {
    // 현재 날짜 설정 (클라이언트 사이드에서만)
    setCurrentDate(new Date().toLocaleDateString("ko-KR"));

    // URL 파라미터에서 닉네임 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const nickname = urlParams.get("nickname");
    if (nickname) {
      setUserNickname(decodeURIComponent(nickname));
    }

    const loadUserAndReportData = async () => {
      try {
        // 사용자 데이터 가져오기
        const userResponse = await fetch(`/api/user?uuid=${uuid}`);
        if (!userResponse.ok) {
          throw new Error("사용자 데이터를 찾을 수 없습니다.");
        }
        const user = await userResponse.json();
        setUserData(user);

        // 전체 리포트 데이터 가져오기 (6개 섹션 모두)
        const sections = ["p1", "p2", "p3", "p4", "p5", "p6"];
        const data: ReportSection[] = [];

        for (const section of sections) {
          const response = await fetch(
            `/api/report/${user.result.toLowerCase()}/${section}`
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

    loadUserAndReportData();
  }, [uuid]);

  const [isGeneratingPDF, setIsGeneratingPDF] = React.useState(false);

  const handleDownloadPDF = async () => {
    setIsGeneratingPDF(true);

    try {
      // 파일명 설정
      const fileName = `${userNickname || userData?.nickname}님의 심화리포트(${
        reportData[0]?.nickname || "report"
      })`;

      // 현재 페이지 URL 생성
      const currentUrl = window.location.href;

      // PDF 생성 API 호출
      const response = await fetch("/api/generate-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          url: currentUrl,
          filename: fileName,
        }),
      });

      if (!response.ok) {
        throw new Error("PDF 생성 실패");
      }

      // PDF 파일 다운로드
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = `${fileName}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("PDF 생성 중 오류:", error);
      alert("PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsGeneratingPDF(false);
    }
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

  if (error || !userData) {
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

  // 유료 결제 확인
  if (userData.is_paid !== 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="text-center w-full max-w-sm mx-auto">
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border border-purple-100">
            <div className="mb-6">
              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star size={24} className="text-purple-600 md:w-8 md:h-8" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-2">
                프리미엄 리포트
              </h1>
              <p className="text-sm md:text-base text-gray-600">
                심화 분석 리포트는 유료 서비스입니다
              </p>
            </div>

            <div className="space-y-2 md:space-y-3 mb-6 text-left">
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                <CheckCircle
                  size={14}
                  className="text-green-600 md:w-4 md:h-4"
                />
                <span>6개 섹션 완전 분석</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                <CheckCircle
                  size={14}
                  className="text-green-600 md:w-4 md:h-4"
                />
                <span>상세한 성향 해석</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                <CheckCircle
                  size={14}
                  className="text-green-600 md:w-4 md:h-4"
                />
                <span>궁합 및 갈등 분석</span>
              </div>
              <div className="flex items-center gap-2 md:gap-3 text-xs md:text-sm text-gray-600">
                <CheckCircle
                  size={14}
                  className="text-green-600 md:w-4 md:h-4"
                />
                <span>PDF 다운로드 가능</span>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() =>
                  alert(
                    "💳 결제 기능을 준비 중이에요! 더 나은 서비스로 곧 찾아뵐게요 🎉"
                  )
                }
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white py-3 px-4 md:px-6 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl text-sm md:text-base"
              >
                결제하고 리포트 보기
              </button>
              <Link
                href={`/me/${uuid}/preview`}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 md:px-6 rounded-lg font-medium transition-all duration-200 inline-block text-sm md:text-base text-center"
              >
                뒤로 가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const nickname = reportData[0]?.nickname || "";

  const getSectionIcon = (index: number) => {
    const icons = [Brain, Heart, Users, Shield, User, Star];
    const Icon = icons[index] || Brain;
    return Icon;
  };

  const getSectionColor = (index: number) => {
    const colors = [
      "from-indigo-50 to-blue-50",
      "from-pink-50 to-purple-50",
      "from-green-50 to-emerald-50",
      "from-orange-50 to-red-50",
      "from-cyan-50 to-teal-50",
      "from-yellow-50 to-amber-50",
    ];
    return colors[index] || colors[0];
  };

  const getSectionIconColor = (index: number) => {
    const colors = [
      "text-indigo-600 bg-indigo-100",
      "text-pink-600 bg-pink-100",
      "text-green-600 bg-green-100",
      "text-orange-600 bg-orange-100",
      "text-cyan-600 bg-cyan-100",
      "text-yellow-600 bg-yellow-100",
    ];
    return colors[index] || colors[0];
  };

  return (
    <>
      {/* 화면용 헤더 (프린트시 숨김) */}
      <div className="print:hidden bg-gradient-to-br from-purple-50 to-pink-50 py-4 md:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-start justify-between md:mb-8">
            <div className="flex items-start gap-3 md:gap-4 flex-1">
              <Link
                href={`/me/${uuid}`}
                className="p-2 hover:bg-white/50 rounded-lg transition-colors flex-shrink-0 mt-1"
              >
                <ArrowLeft
                  size={20}
                  className="text-purple-600 md:w-6 md:h-6"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <h1 className="text-lg md:text-2xl font-bold leading-tight mb-1">
                  <span className="text-green-700 py-1 rounded-lg">
                    {userNickname || userData?.nickname}님
                  </span>
                  <span className="text-gray-800 ml-1">의 심화 리포트</span>
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  6개 섹션 전체 분석을 확인해보세요
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF}
              className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-3 py-2 md:px-6 md:py-3 rounded-lg transition-all shadow-lg text-sm md:text-base flex-shrink-0 ml-2"
            >
              {isGeneratingPDF ? (
                <>
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span className="hidden sm:inline">PDF 생성 중...</span>
                  <span className="sm:hidden">생성중</span>
                </>
              ) : (
                <>
                  <Download size={16} className="md:w-5 md:h-5" />
                  <span className="hidden sm:inline">PDF 다운로드</span>
                  <span className="sm:hidden">PDF</span>
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* 리포트 콘텐츠 */}
      <div className="bg-white print:bg-white report-content">
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
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-4 py-2 rounded-full text-sm font-medium text-green-700 mb-6 print:hidden">
                  <CheckCircle size={16} />
                  프리미엄 리포트
                </div>
                <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 print:text-4xl print:text-gray-800">
                  감정 성향 심화 분석
                </h1>
                <div className="text-2xl font-bold text-gray-700 mb-2">
                  {nickname}
                </div>
                <div className="text-lg text-gray-600 mb-8">
                  {userNickname || userData?.nickname}님을 위한 개인 맞춤 리포트
                </div>
              </div>

              {/* 목차 */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-purple-100 max-w-2xl mx-auto">
                <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
                  📋 리포트 목차
                </h2>
                <div className="grid gap-3 text-left">
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-indigo-50 to-blue-50">
                    <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <span className="font-medium">성향 상세 해석</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-pink-50 to-purple-50">
                    <div className="w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <span className="font-medium">유형별 궁합 분석</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-green-50 to-emerald-50">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <span className="font-medium">갈등 대응 전략</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-orange-50 to-red-50">
                    <div className="w-8 h-8 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-sm font-bold">
                      4
                    </div>
                    <span className="font-medium">감정 관리 루틴</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-cyan-50 to-teal-50">
                    <div className="w-8 h-8 bg-cyan-100 text-cyan-600 rounded-full flex items-center justify-center text-sm font-bold">
                      5
                    </div>
                    <span className="font-medium">페르소나 매칭</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-yellow-50 to-amber-50">
                    <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold">
                      6
                    </div>
                    <span className="font-medium">최종 정리</span>
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

          {/* 전체 섹션들 */}
          {reportData.map((section, index) => {
            const Icon = getSectionIcon(index);
            const colorClass = getSectionColor(index);
            const iconColorClass = getSectionIconColor(index);

            return (
              <div key={index} className="mb-16">
                {/* 섹션 헤더 */}
                <div className="relative mb-12">
                  <div className="flex items-start gap-6 mb-6">
                    <div
                      className={`p-4 rounded-2xl ${iconColorClass} shadow-lg relative`}
                    >
                      <Icon size={28} />
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-3xl font-bold text-gray-800">
                          {section.section}
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent"></div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-transparent p-4 rounded-xl border-l-4 border-purple-400">
                        <p className="text-gray-700 leading-relaxed italic">
                          {section.summary}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 섹션 콘텐츠 */}
                <div
                  className={`bg-gradient-to-br ${colorClass} rounded-2xl p-8 shadow-lg`}
                >
                  {/* P1: 성향 상세 해석 */}
                  {index === 0 && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-purple-200"
                        >
                          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center text-purple-600 font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="mb-4">
                            <div className="w-12 h-1 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mb-4"></div>
                            <h3 className="font-bold text-gray-800 mb-4 text-lg leading-tight">
                              {item.title}
                            </h3>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            {item.description}
                          </p>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
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
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-pink-200"
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
                              <h3 className="font-bold text-gray-800 text-lg">
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
                          <div className="pl-6 border-l-2 border-gray-200">
                            <p className="text-gray-700 leading-relaxed">
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
                            }`}
                          ></div>
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
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
                        >
                          <div className="absolute top-4 right-4 w-8 h-8 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center text-green-600 font-bold text-sm">
                            {idx + 1}
                          </div>
                          <div className="mb-4">
                            <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full mb-4"></div>
                            <h3 className="font-bold text-gray-800 mb-4 text-lg leading-tight">
                              📍 {item.situation}
                            </h3>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                            <p className="text-gray-700 leading-relaxed">
                              💡 {item.strategy}
                            </p>
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
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-blue-200 hover:scale-105"
                        >
                          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-t-2xl"></div>
                          <div className="pt-4">
                            {/* <div className="flex items-center gap-3 mb-4">
                              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center text-2xl">
                                {item.routine
                                  ? item.routine.split(" ")[0]
                                  : "🧘"}
                              </div>
                              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {idx + 1}
                              </div>
                            </div> */}
                            <h3 className="font-bold text-gray-800 text-lg mb-4 leading-tight">
                              {item.routine || item.title}
                            </h3>
                            <p className="text-gray-700 leading-relaxed text-sm">
                              {item.description || item.detail}
                            </p>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P5: 실제 사례 페르소나 매칭 */}
                  {index === 4 && (
                    <div className="space-y-6 md:space-y-8">
                      {section.content.map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="group relative bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 hover:border-purple-200"
                        >
                          <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400"></div>
                          <div className="p-4 md:p-8">
                            <div className="flex items-start gap-3 md:gap-6 mb-4 md:mb-6">
                              <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl md:rounded-2xl flex items-center justify-center text-purple-600 font-bold text-lg md:text-2xl border-2 border-purple-200 flex-shrink-0">
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-2 md:mb-3">
                                  <span className="text-xs font-bold text-purple-600 bg-purple-100 px-2 py-1 md:px-3 md:py-1 rounded-full">
                                    캐릭터
                                  </span>
                                </div>
                                <h3 className="font-bold text-gray-800 text-lg md:text-xl mb-2 leading-tight">
                                  {item.persona || item.title}
                                </h3>
                              </div>
                            </div>
                            <div className="md:pl-22">
                              <div className="bg-gradient-to-r from-purple-50 via-pink-50 to-indigo-50 p-4 md:p-6 rounded-xl border-l-4 border-purple-300">
                                <p className="text-sm md:text-base text-gray-700 leading-relaxed">
                                  {item.description || item.detail}
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-300 via-pink-300 to-indigo-300 opacity-20"></div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* P6: 최종 정리 */}
                  {index === 5 && (
                    <div className="bg-gradient-to-br rounded-2xl md:rounded-3xl p-6 md:p-10">
                      <div className="text-center mb-6 md:mb-8">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-green-700 mb-3 md:mb-4">
                          <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></span>
                          KEY INSIGHTS
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800">
                          당신을 위한 핵심 포인트
                        </h3>
                      </div>
                      <div className="grid gap-3 md:gap-4 md:grid-cols-2">
                        {section.content.map((item: any, idx: number) => (
                          <div
                            key={idx}
                            className="group relative bg-white/80 backdrop-blur-sm rounded-xl md:rounded-2xl p-4 md:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 hover:border-green-200"
                          >
                            <div className="flex items-start gap-3 md:gap-4">
                              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-400 to-emerald-400 rounded-full flex items-center justify-center text-white font-bold text-xs md:text-sm flex-shrink-0">
                                ✓
                              </div>
                              <p className="text-sm md:text-base text-gray-700 leading-relaxed flex-1">
                                {typeof item === "string"
                                  ? item.replace("✔ ", "")
                                  : item.summary ||
                                    item.title ||
                                    item.detail ||
                                    item.description}
                              </p>
                            </div>
                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-green-200 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 섹션 노트 */}
                  {section.note && (
                    <div className="mt-8 p-6 bg-white/50 rounded-lg border-l-4 border-purple-400">
                      <p className="text-gray-700 italic leading-relaxed">
                        💡 {section.note}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* 완료 메시지 */}
          <div className="relative mt-20 mb-16 print:hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl opacity-90"></div>
            <div className="relative text-center py-16 px-8 text-white">
              <div className="mb-8">
                <CheckCircle size={48} className="mx-auto mb-4 opacity-80" />
                <h3 className="text-3xl font-bold mb-4">
                  리포트 분석이 완료되었습니다!
                </h3>
                <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                  총 6개 섹션의 완전한 분석을 통해
                  <br />
                  당신의 감정 성향을 깊이 있게 이해해보세요.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownloadPDF}
                disabled={isGeneratingPDF}
                className="bg-white text-green-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-all shadow-lg"
              >
                {isGeneratingPDF ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                    PDF 생성 중...
                  </div>
                ) : (
                  "PDF로 저장하기"
                )}
              </motion.button>

              <div className="mt-6 text-sm opacity-90">
                💾 PDF 다운로드로 언제든지 다시 확인하세요 <br />✨ 친구들과
                공유하고 궁합도 비교해보세요
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
