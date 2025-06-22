"use client";

import { Users, Sparkles, Brain, Heart, Copy, Check } from "lucide-react";
import compatibilityDescriptions from "@/data/compatibilityDescriptions.json";
import typeDescriptions from "@/data/typeDescriptions.json";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import Script from "next/script";

interface MyPageContentProps {
  myType: string;
  nickname: string;
  email?: string | null;
  uuid: string;
  connections: {
    nickname: string;
    type: string;
  }[];
}

declare global {
  interface Window {
    Kakao: any;
  }
}

export function MyPageContent({
  myType,
  nickname,
  uuid,
  email,
  connections,
}: MyPageContentProps) {
  const [pendingShareType, setPendingShareType] = useState<
    "kakao" | "link" | "twitter" | "instagram" | null
  >(null);
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (window.Kakao && !window.Kakao.isInitialized()) {
      window.Kakao.init("47e9e842805216474700f75e72891072");
    }
  }, []);

  // 궁합 정보 가져오기
  const getCompatibility = (myType: string, friendType: string) => {
    const matchKey = `${myType}_${friendType}`;
    const reverseMatchKey = `${friendType}_${myType}`;
    return (
      compatibilityDescriptions[
        matchKey as keyof typeof compatibilityDescriptions
      ] ||
      compatibilityDescriptions[
        reverseMatchKey as keyof typeof compatibilityDescriptions
      ]
    );
  };

  // 내 타입 정보 가져오기
  const myTypeInfo = typeDescriptions[myType as keyof typeof typeDescriptions];
  const freeReport = myTypeInfo?.freeReport;

  const openToast = (text: string) => {
    const toast = document.createElement("div");
    toast.className =
      "fixed top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg z-[9999]";
    toast.textContent = text;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  };

  const copyCurrentUrl = async () => {
    const currentUrl = window.location.href;

    // 1차 시도: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(currentUrl);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      } catch (err) {
        console.warn("Clipboard API failed, trying fallback method:", err);
      }
    }

    // 2차 시도: 텍스트 선택 방식 (모바일 호환)
    try {
      const textArea = document.createElement("textarea");
      textArea.value = currentUrl;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const result = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (result) {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
        return;
      }
    } catch (err) {
      console.warn("Fallback copy method failed:", err);
    }

    // 3차 시도: 모바일에서 텍스트 선택 후 사용자가 복사하도록 안내
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      const result = prompt("아래 URL을 길게 누르고 복사해주세요:", currentUrl);
      if (result === null) {
        // 사용자가 취소하지 않았다면 복사된 것으로 간주
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } else {
      // 데스크톱에서는 alert로 URL 제공
      alert(`URL 복사에 실패했습니다. 직접 복사해주세요:\n${currentUrl}`);
    }
  };

  const handleKakaoShare = () => {
    if (typeof window === "undefined" || !window.Kakao) {
      console.error("Kakao SDK not loaded");
      openToast(
        "카카오톡 공유 기능을 불러오는 중입니다. 잠시 후 다시 시도해주세요."
      );
      return;
    }

    if (!window.Kakao.isInitialized()) {
      console.error("Kakao SDK not initialized");
      window.Kakao.init("47e9e842805216474700f75e72891072");
    }

    const shareUrl = `${
      process.env.NEXT_PUBLIC_DOMAIN_URL
    }/?from=${uuid}&type=${myType}&nickname=${encodeURIComponent(nickname)}`;
    const imageUrl =
      "https://k.kakaocdn.net/14/dn/btsNLud86iV/AGBAQzr2QTze43Zd46Z3Bk/o.jpg";

    console.log("Sharing details:", {
      domain: process.env.NEXT_PUBLIC_DOMAIN_URL,
      uuid,
      myType,
      nickname,
      fullUrl: shareUrl,
    });

    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `나의 감정 성향, 궁금하지 않아? ${nickname}과의 궁합도 확인해봐`,
          description: "나와 너의 감정 성향 우리 궁합은 얼마나 잘 맞을까? 👀",
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: shareUrl,
            webUrl: shareUrl,
          },
        },
        buttons: [
          {
            title: "나도 테스트하러 가기",
            link: {
              mobileWebUrl: shareUrl,
              webUrl: shareUrl,
            },
          },
        ],
        serverCallbackArgs: {
          // 서버 콜백 시 추가로 전달하고 싶은 파라미터가 있다면 여기에 추가
          userType: myType,
          userName: nickname,
        },
      });
    } catch (error: unknown) {
      console.error("Kakao share error:", error);
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      }
      openToast(
        "카카오톡 공유 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
      );
    }
  };

  const handleShare = (type: "kakao" | "link" | "twitter" | "instagram") => {
    const shareUrl = `${
      process.env.NEXT_PUBLIC_DOMAIN_URL
    }/?from=${uuid}&type=${myType}&nickname=${encodeURIComponent(nickname)}`;

    switch (type) {
      case "kakao":
        handleKakaoShare();
        break;
      case "link":
        navigator.clipboard.writeText(shareUrl);
        openToast("링크가 복사되었습니다");
        break;
      case "twitter":
        const twitterText = `나의 감정 성향: ${nickname}\n친구들과 궁합을 확인해보세요!`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            twitterText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "instagram":
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        if (isMobile) {
          window.location.href = `instagram://story-camera`;
          setTimeout(() => {
            alert(
              "Instagram 앱이 필요합니다. 링크를 복사하여 직접 공유해주세요."
            );
            navigator.clipboard.writeText(shareUrl);
            openToast("링크가 복사되었습니다");
          }, 500);
        } else {
          alert(
            "Instagram 공유는 모바일 앱에서만 가능합니다. 링크를 복사하여 직접 공유해주세요."
          );
          navigator.clipboard.writeText(shareUrl);
          openToast("링크가 복사되었습니다");
        }
        break;
    }
  };

  return (
    <>
      <Script
        src="https://t1.kakaocdn.net/kakao_js_sdk/2.4.0/kakao.min.js"
        strategy="beforeInteractive"
        onLoad={() => {
          if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init("47e9e842805216474700f75e72891072");
          }
        }}
      />
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-10 px-6">
        <div className="max-w-3xl mx-auto space-y-8">
          {/* URL 저장 안내 */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-orange-50 border border-orange-200 rounded-xl p-4"
          >
            <div className="flex items-start gap-3">
              <div className="text-orange-500 text-xl">⚠️</div>
              <div className="flex-1">
                <h4 className="text-orange-800 font-semibold text-sm mb-1">
                  중요! 마이페이지 URL을 저장해주세요
                </h4>
                <p className="text-orange-700 text-xs leading-relaxed mb-3">
                  별도 로그인이 없어 이 URL을 잃어버리면 다시 접근할 수
                  없습니다.
                  <br />
                  즐겨찾기에 추가하거나 메모해두시기 바랍니다.
                </p>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={copyCurrentUrl}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    isCopied
                      ? "bg-green-500 text-white"
                      : "bg-orange-500 hover:bg-orange-600 text-white"
                  }`}
                >
                  {isCopied ? (
                    <>
                      <Check size={14} />
                      복사 완료!
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      URL 복사하기
                    </>
                  )}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* 무료 리포트 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden"
          >
            <div className="p-6 border-b border-purple-100">
              <div className="flex items-center justify-center gap-2 text-purple-600 mb-4">
                <Sparkles size={24} />
                <h1 className="text-2xl font-bold">나의 감정 성향 리포트</h1>
              </div>
              <p className="text-center text-gray-600">
                {nickname || email}님의 감정 유형:{" "}
                <span className="font-bold text-purple-600">
                  {myTypeInfo.nickname}
                </span>
              </p>
            </div>

            {freeReport && (
              <div className="p-6 space-y-6">
                {/* 감정 스타일 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="text-purple-600" size={20} />
                    <h3 className="text-lg font-semibold text-purple-700">
                      감정 스타일
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {freeReport.emotionalStyle}
                  </p>
                </motion.div>

                {/* 강점 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                  className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="text-green-600" size={20} />
                    <h3 className="text-lg font-semibold text-green-700">
                      나의 강점
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {freeReport.strengthPoints.map(
                      (point: string, index: number) => (
                        <li
                          key={index}
                          className="flex items-center gap-2 text-gray-700"
                        >
                          <span className="text-green-500">✦</span>
                          {point}
                        </li>
                      )
                    )}
                  </ul>
                </motion.div>

                {/* 일상 패턴 */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="text-blue-600" size={20} />
                    <h3 className="text-lg font-semibold text-blue-700">
                      일상 속 나의 모습
                    </h3>
                  </div>
                  <p className="text-gray-700 leading-relaxed">
                    {freeReport.dailyPattern}
                  </p>
                </motion.div>
              </div>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl p-8 border-2 border-indigo-100 shadow-lg relative overflow-hidden mb-8"
          >
            {/* 배경 장식 */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-200/30 to-purple-200/30 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
                  더 알고 싶은 당신에게
                </h3>
                <div className="space-y-3 text-gray-700">
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-indigo-500 font-semibold">•</span>
                    <span>나랑 잘 맞는 사람은 누구일까?</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-purple-500 font-semibold">•</span>
                    <span>왜 관계에서 자꾸 상처받을까?</span>
                  </div>
                  <div className="flex items-center gap-3 bg-white/60 rounded-lg p-3 backdrop-blur-sm">
                    <span className="text-pink-500 font-semibold">•</span>
                    <span>감정을 조절하는 내 방식, 괜찮은 걸까?</span>
                  </div>
                </div>
              </div>

              <div className="text-center mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">
                  <span className="text-lg">👀</span> 나의 감정 성향을 깊이 있게
                  풀어주는
                  <br />
                  <span className="font-bold text-indigo-600 text-lg">
                    5페이지 분량의 진짜 나를 알아보는 리포트
                  </span>
                  를 받아보세요.
                </p>
                <div className="bg-white/70 rounded-lg p-4 backdrop-blur-sm text-left max-w-md mx-auto">
                  <div className="space-y-2 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500">-</span>
                      <span>🧠 성향 상세 해석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-indigo-500">-</span>
                      <span>💞 유형별 궁합 분석</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-500">-</span>
                      <span>🛠️ 갈등 대응 전략</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-pink-500">-</span>
                      <span>🧘 감정 관리 루틴</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">-</span>
                      <span>🧩 실제 사례 페르소나 매칭까지!</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-center gap-4">
                <Link href={`/me/${uuid}/preview`}>
                  <motion.button
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 10px 30px -5px rgba(79, 70, 229, 0.3)",
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-lg border-2 border-indigo-500/20 relative overflow-hidden"
                    style={{
                      backgroundColor: "#4f46e5",
                      backgroundImage:
                        "linear-gradient(to right, #4f46e5, #9333ea)",
                      border: "2px solid rgba(79, 70, 229, 0.2)",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
                    <div className="relative flex items-center gap-2">
                      <span>상세 리포트 미리보기</span>
                      <span className="text-lg">→</span>
                    </div>
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>

          {/* 기존 궁합 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-2 text-purple-600"
          >
            <Users size={24} />
            <h1 className="text-3xl font-bold text-center">
              {nickname || email}님과 공유한 친구들과의 궁합
            </h1>
          </motion.div>
          {/* 공유 섹션 */}

          {connections.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-center text-gray-600 mt-10"
            >
              아직 공유를 통해 들어온 친구가 없습니다.
            </motion.p>
          ) : (
            <div className="space-y-8">
              {connections.map((connection, index) => {
                const compatibility = getCompatibility(myType, connection.type);
                if (!compatibility) return null;

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 * index, duration: 0.5 }}
                    className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden"
                  >
                    {/* 헤더 */}
                    <div className="p-6 border-b border-purple-100">
                      <h2 className="text-xl font-bold text-gray-800 text-center">
                        {connection.nickname}님과의 궁합
                      </h2>
                      <p className="text-purple-600 font-medium text-center mt-2">
                        &quot;{compatibility.title}&quot;
                      </p>
                    </div>

                    {/* 요약 */}
                    <div className="bg-purple-50 p-6">
                      <p className="text-gray-700 text-center leading-relaxed">
                        {compatibility.summary}
                      </p>
                    </div>

                    {/* 상세 정보 */}
                    <div className="p-6 space-y-4">
                      {/* 잘 맞는 부분 */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index + 0.3, duration: 0.5 }}
                        className="p-4 bg-green-50 rounded-lg border border-green-100"
                      >
                        <h3 className="flex items-center gap-2 font-bold text-green-700 mb-2">
                          <span className="text-xl">👍</span> 잘 맞는 부분
                        </h3>
                        <p className="text-gray-700">{compatibility.good}</p>
                      </motion.div>

                      {/* 주의할 점 */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index + 0.4, duration: 0.5 }}
                        className="p-4 bg-red-50 rounded-lg border border-red-100"
                      >
                        <h3 className="flex items-center gap-2 font-bold text-red-700 mb-2">
                          <span className="text-xl">⚠️</span> 주의할 점
                        </h3>
                        <p className="text-gray-700">{compatibility.caution}</p>
                      </motion.div>

                      {/* 조언 */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 * index + 0.5, duration: 0.5 }}
                        className="p-4 bg-purple-50 rounded-lg border border-purple-100"
                      >
                        <h3 className="flex items-center gap-2 font-bold text-purple-700 mb-2">
                          <span className="text-xl">💡</span> 조언
                        </h3>
                        <p className="text-gray-700">{compatibility.advice}</p>
                      </motion.div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-md border border-purple-100 overflow-hidden p-8 space-y-6"
          >
            <div className="text-center space-y-3">
              <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
                친구들과 공유하기
              </h3>
              <div className="relative">
                <p className="text-purple-600 font-medium bg-purple-50/80 px-6 py-3 rounded-xl inline-block shadow-sm">
                  SNS나 링크로 공유해보세요! ✨
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 sm:mt-8 px-4 sm:px-0">
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={() => handleShare("kakao")}
                  className="relative w-full bg-yellow-400 hover:bg-yellow-500 border-yellow-500 h-[52px] rounded-xl group"
                >
                  <div className="relative flex flex-col items-center justify-center gap-1">
                    <Image
                      src="/icon_kakao.png"
                      alt="카카오톡 공유"
                      width={24}
                      height={24}
                      className="transition-transform"
                      priority
                    />
                    <span className="text-[#3A1D1D] text-xs font-medium">
                      카카오톡
                    </span>
                  </div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={() => handleShare("link")}
                  className="relative w-full bg-white hover:bg-purple-50 border-purple-200 h-[52px] rounded-xl group"
                >
                  <div className="relative flex flex-col items-center justify-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-600"
                    >
                      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                    </svg>
                    <span className="text-purple-600 text-xs font-medium">
                      링크 복사
                    </span>
                  </div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={() => handleShare("twitter")}
                  className="relative w-full bg-black hover:bg-gray-900 border-gray-800 h-[52px] rounded-xl group"
                >
                  <div className="relative flex flex-col items-center justify-center gap-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M14.2833 10.1571L23.0508 0H20.9833L13.3666 8.85714L7.28327 0H0L9.15 13.3L0 23.8857H2.06751L10.0667 14.6L16.4833 23.8857H23.7666L14.2833 10.1571ZM11.1167 13.4143L10.2167 12.1571L2.83332 1.77143H6.33332L12.2667 10.0429L13.1667 11.3L20.9833 22.2H17.4833L11.1167 13.4143Z"
                        fill="white"
                      />
                    </svg>
                    <span className="text-white text-xs font-medium">
                      X (트위터)
                    </span>
                  </div>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  onClick={() => handleShare("instagram")}
                  className="relative w-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 hover:opacity-90 border-transparent h-[52px] rounded-xl group"
                >
                  <div className="relative flex flex-col items-center justify-center gap-1">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M12 2C14.717 2 15.056 2.01 16.122 2.06C17.187 2.11 17.912 2.277 18.55 2.525C19.21 2.779 19.766 3.123 20.322 3.678C20.8305 4.1779 21.224 4.78259 21.475 5.45C21.722 6.087 21.89 6.813 21.94 7.878C21.987 8.944 22 9.283 22 12C22 14.717 21.99 15.056 21.94 16.122C21.89 17.187 21.722 17.912 21.475 18.55C21.2247 19.2178 20.8311 19.8226 20.322 20.322C19.822 20.8303 19.2173 21.2238 18.55 21.475C17.913 21.722 17.187 21.89 16.122 21.94C15.056 21.987 14.717 22 12 22C9.283 22 8.944 21.99 7.878 21.94C6.813 21.89 6.088 21.722 5.45 21.475C4.78233 21.2245 4.17753 20.8309 3.678 20.322C3.16941 19.8222 2.77593 19.2175 2.525 18.55C2.277 17.913 2.11 17.187 2.06 16.122C2.013 15.056 2 14.717 2 12C2 9.283 2.01 8.944 2.06 7.878C2.11 6.812 2.277 6.088 2.525 5.45C2.77524 4.78218 3.1688 4.17732 3.678 3.678C4.17767 3.16923 4.78243 2.77573 5.45 2.525C6.088 2.277 6.812 2.11 7.878 2.06C8.944 2.013 9.283 2 12 2ZM12 7C10.6739 7 9.40215 7.52678 8.46447 8.46447C7.52678 9.40215 7 10.6739 7 12C7 13.3261 7.52678 14.5979 8.46447 15.5355C9.40215 16.4732 10.6739 17 12 17C13.3261 17 14.5979 16.4732 15.5355 15.5355C16.4732 14.5979 17 13.3261 17 12C17 10.6739 16.4732 9.40215 15.5355 8.46447C14.5979 7.52678 13.3261 7 12 7ZM18.5 6.75C18.5 6.41848 18.3683 6.10054 18.1339 5.86612C17.8995 5.6317 17.5815 5.5 17.25 5.5C16.9185 5.5 16.6005 5.6317 16.3661 5.86612C16.1317 6.10054 16 6.41848 16 6.75C16 7.08152 16.1317 7.39946 16.3661 7.63388C16.6005 7.8683 16.9185 8 17.25 8C17.5815 8 17.8995 7.8683 18.1339 7.63388C18.3683 7.39946 18.5 7.08152 18.5 6.75ZM12 9C12.7956 9 13.5587 9.31607 14.1213 9.87868C14.6839 10.4413 15 11.2044 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15C11.2044 15 10.4413 14.6839 9.87868 14.1213C9.31607 13.5587 9 12.7956 9 12C9 11.2044 9.31607 10.4413 9.87868 9.87868C10.4413 9.31607 11.2044 9 12 9Z"
                        fill="white"
                      />
                    </svg>
                    <span className="text-white text-xs font-medium">
                      인스타그램
                    </span>
                  </div>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
