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
  Lock,
} from "lucide-react";
import Link from "next/link";

interface PreviewPageProps {
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
}

export default function PreviewPage({ params }: PreviewPageProps) {
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

        // 리포트 데이터 가져오기 (첫 2개 섹션만 미리보기)
        const sections = ["p1", "p2"]; // 미리보기는 처음 2개 섹션만
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

  const handleUpgrade = () => {
    alert(
      "🚀 곧 만나요! 결제 시스템을 열심히 준비 중이에요. 조금만 기다려주세요! ✨"
    );
  };

  const scrollToUpgrade = () => {
    const upgradeSection = document.getElementById("upgrade-section");
    if (upgradeSection) {
      upgradeSection.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
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

  const nickname = reportData[0]?.nickname || "";

  const getSectionIcon = (index: number) => {
    const icons = [Brain, Heart];
    const Icon = icons[index] || Brain;
    return Icon;
  };

  const getSectionColor = (index: number) => {
    const colors = ["from-indigo-50 to-blue-50", "from-pink-50 to-purple-50"];
    return colors[index] || colors[0];
  };

  const getSectionIconColor = (index: number) => {
    const colors = [
      "text-indigo-600 bg-indigo-100",
      "text-pink-600 bg-pink-100",
    ];
    return colors[index] || colors[0];
  };

  return (
    <>
      {/* 화면용 헤더 */}
      <div className="bg-gradient-to-br from-purple-50 to-pink-50 py-4 md:py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="flex items-start justify-between mb-6 md:mb-8">
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
                  <span className="text-purple-700 bg-purple-50 py-1 rounded-lg">
                    {userNickname || userData?.nickname}님
                  </span>
                  <span className="text-gray-800 ml-1">
                    의 심화 리포트 미리보기
                  </span>
                </h1>
                <p className="text-sm md:text-base text-gray-600">
                  처음 2개 섹션을 무료로 확인해보세요
                </p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={scrollToUpgrade}
              className="flex items-center gap-1 md:gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-3 py-2 md:px-6 md:py-3 rounded-lg transition-all shadow-lg text-sm md:text-base flex-shrink-0 ml-2"
            >
              <Lock size={16} className="md:w-5 md:h-5" />
              <span className="hidden sm:inline">전체 리포트 구매</span>
              <span className="sm:hidden">구매</span>
            </motion.button>
          </div>
        </div>
      </div>

      {/* 리포트 콘텐츠 */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          {/* 표지 */}
          <div className="text-center mb-12 md:mb-16 relative overflow-hidden">
            {/* 배경 장식 */}
            <div className="absolute inset-0 opacity-5 hidden md:block">
              <div className="absolute top-10 left-10 w-32 h-32 bg-purple-300 rounded-full blur-3xl"></div>
              <div className="absolute top-32 right-20 w-24 h-24 bg-pink-300 rounded-full blur-2xl"></div>
              <div className="absolute bottom-20 left-1/3 w-40 h-40 bg-indigo-300 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
              <div className="mb-8 md:mb-12">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-medium text-purple-700 mb-4 md:mb-6">
                  <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-pulse"></span>
                  FREE PREVIEW
                </div>
                <h1 className="text-2xl md:text-5xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 bg-clip-text text-transparent mb-4 md:mb-6 leading-tight">
                  감정 성향 심화 분석
                </h1>
                <div className="relative inline-block">
                  <h2 className="text-xl md:text-3xl text-gray-800 font-bold relative z-10">
                    {nickname}
                  </h2>
                  <div className="absolute -bottom-1 md:-bottom-2 left-0 right-0 h-2 md:h-3 bg-gradient-to-r from-purple-200 to-pink-200 opacity-50"></div>
                </div>
                <p className="text-sm md:text-base text-gray-600 mt-3 md:mt-4">
                  {userNickname || userData?.nickname}님의 개인화된 분석 리포트
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm border border-purple-100 rounded-2xl md:rounded-3xl p-8 md:p-10 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8 md:gap-8 text-left">
                  <div className="space-y-4 md:space-y-4">
                    <div className="flex items-center gap-4 mb-4 md:mb-4">
                      <div className="w-8 h-8 md:w-8 md:h-8 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-white text-sm md:text-sm font-bold">
                          ✓
                        </span>
                      </div>
                      <h3 className="font-bold text-gray-800 text-xl md:text-lg">
                        무료 미리보기
                      </h3>
                    </div>
                    <div className="space-y-3 md:space-y-3 text-base md:text-sm text-gray-700">
                      <div className="flex items-center gap-3 md:gap-3 p-3 md:p-2 rounded-lg bg-green-50">
                        <div className="w-2.5 h-2.5 md:w-2 md:h-2 bg-green-400 rounded-full"></div>
                        <span>성향 상세 해석</span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-3 p-3 md:p-2 rounded-lg bg-green-50">
                        <div className="w-2.5 h-2.5 md:w-2 md:h-2 bg-green-400 rounded-full"></div>
                        <span>유형별 궁합 분석</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4 md:space-y-4">
                    <div className="flex items-center gap-4 mb-4 md:mb-4">
                      <div className="w-8 h-8 md:w-8 md:h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-lg flex items-center justify-center">
                        <Lock size={16} className="text-white md:w-4 md:h-4" />
                      </div>
                      <h3 className="font-bold text-gray-800 text-xl md:text-lg">
                        프리미엄 콘텐츠
                      </h3>
                    </div>
                    <div className="space-y-3 md:space-y-3 text-base md:text-sm text-gray-500">
                      <div className="flex items-center gap-3 md:gap-3 p-3 md:p-2 rounded-lg bg-gray-50">
                        <Lock size={14} className="md:w-3 md:h-3" />
                        <span>갈등 대응 전략</span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-3 p-3 md:p-2 rounded-lg bg-gray-50">
                        <Lock size={14} className="md:w-3 md:h-3" />
                        <span>감정 관리 루틴</span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-3 p-3 md:p-2 rounded-lg bg-gray-50">
                        <Lock size={14} className="md:w-3 md:h-3" />
                        <span>페르소나 매칭</span>
                      </div>
                      <div className="flex items-center gap-3 md:gap-3 p-3 md:p-2 rounded-lg bg-gray-50">
                        <Lock size={14} className="md:w-3 md:h-3" />
                        <span>최종 정리</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 md:mt-8 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="flex items-center justify-center gap-2 text-gray-500 text-xs md:text-sm">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <span>생성일: {currentDate}</span>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 미리보기 섹션들 */}
          {reportData.map((section, index) => {
            const Icon = getSectionIcon(index);
            const colorClass = getSectionColor(index);
            const iconColorClass = getSectionIconColor(index);

            return (
              <div key={index} className="mb-12 md:mb-16">
                {/* 섹션 헤더 */}
                <div className="relative mb-8 md:mb-12">
                  <div className="flex items-start gap-4 md:gap-6 mb-4 md:mb-6">
                    <div
                      className={`p-3 md:p-4 rounded-xl md:rounded-2xl ${iconColorClass} shadow-lg relative flex-shrink-0`}
                    >
                      <Icon size={20} className="md:w-7 md:h-7" />
                      <div className="absolute -top-0.5 -right-0.5 md:-top-1 md:-right-1 w-3 h-3 md:w-4 md:h-4 bg-white rounded-full flex items-center justify-center shadow-md">
                        <span className="text-xs font-bold text-gray-600">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-xl md:text-3xl font-bold text-gray-800">
                          {section.section}
                        </h2>
                        <div className="flex-1 h-px bg-gradient-to-r from-gray-300 to-transparent hidden md:block"></div>
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-transparent p-3 md:p-4 rounded-lg md:rounded-xl border-l-4 border-purple-400">
                        <p className="text-sm md:text-base text-gray-700 leading-relaxed italic">
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
                    <div className="space-y-6">
                      {section.content
                        .slice(0, 1)
                        .map((item: any, idx: number) => (
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

                      {/* 더 보기 유도 */}
                      <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2 text-gray-500 text-sm mb-4">
                          <Lock size={16} />
                          <span className="mr-2">
                            나머지 {section.content.length - 1}개 성향 분석은
                            프리미엄에서
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={scrollToUpgrade}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg"
                        >
                          전체 분석 보기
                        </motion.button>
                      </div>
                    </div>
                  )}

                  {/* P2: 유형별 궁합 분석 */}
                  {index === 1 && (
                    <div className="space-y-6">
                      {section.content
                        .filter(
                          (match: any) =>
                            match.matchLevel === "주의 궁합" ||
                            match.matchLevel === "최고 궁합"
                        )
                        .slice(0, 2)
                        .map((match: any, idx: number) => (
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

                      {/* 더 보기 유도 */}
                      <div className="text-center py-8">
                        <div className="inline-flex items-center gap-2 text-gray-500 text-sm mb-4">
                          <Lock size={16} />
                          <span className="mr-2">
                            나머지 {section.content.length - 2}개 궁합 분석은
                            프리미엄에서
                          </span>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={scrollToUpgrade}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 py-3 rounded-lg transition-all shadow-lg"
                        >
                          전체 분석 보기
                        </motion.button>
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

          {/* 프리미엄 업그레이드 CTA */}
          <div id="upgrade-section" className="relative mt-20 mb-16">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-90"></div>
            <div className="relative text-center py-16 px-8 text-white">
              <div className="mb-8">
                <Lock size={48} className="mx-auto mb-4 opacity-80" />
                <h3 className="text-3xl font-bold mb-4">
                  나머지 4개 섹션이 더 있어요!
                </h3>
                <p className="text-lg opacity-90 max-w-2xl mx-auto leading-relaxed">
                  갈등 대응 전략, 감정 관리 루틴, 페르소나 매칭, 최종 정리까지
                  <br />총 6개 섹션의 완전한 분석을 확인해보세요.
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleUpgrade}
                className="bg-white text-purple-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition-all shadow-lg"
              >
                전체 리포트 구매하기(₩1,000원)
              </motion.button>

              <div className="mt-6 text-sm ">
                💝 런칭 기념 특가! 정가 ₩2,000원 → ₩1,000원 (50% 할인) <br />✨
                PDF 다운로드 포함 • 평생 소장 가능
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
