"use client";

declare global {
  interface Window {
    Kakao: any;
  }
}
import * as React from "react";
import { calculateResult } from "@/app/lib/calculateResult";
import { ResultActions } from "@/components/ResultActions";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import KakaoShareButton from "@/components/KakaoShareButton";
import NicknameModal from "@/components/NicknameModal";
import { Users } from "lucide-react"; // 아이콘 라이브러리 사용
import compatibilityDescriptions from "@/data/compatibilityDescriptions.json";
import Image from "next/image";
import { Suspense } from "react";
import { SearchParamsHandler } from "@/components/SearchParamsHandler";
import Head from "next/head";
import { motion } from "framer-motion";

const reactionGifs: Record<string, { img: string }> = {
  A1: { img: "/gifs/a1.png" },
  A2: { img: "/gifs/a2.png" },
  B1: { img: "/gifs/b1.png" },
  B2: { img: "/gifs/b2.png" },
  C1: { img: "/gifs/c1.png" },
  C2: { img: "/gifs/c2.png" },
  D1: { img: "/gifs/d1.png" },
  D2: { img: "/gifs/d2.png" },
};

export default function ResultPage() {
  const [result, setResult] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [fromInfo, setFromInfo] = React.useState<{
    from: string;
    fromType: string;
    fromNickname: string;
  } | null>(null);
  const [compatibility, setCompatibility] = React.useState<any>(null);
  const [nickname, setNickname] = React.useState("");
  const [relationSaved, setRelationSaved] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const uuid =
    typeof window !== "undefined" ? localStorage.getItem("uuid") : null;

  const handleKakaoShare = (nickname: string) => {
    if (typeof window === "undefined" || !window.Kakao) {
      console.error("Kakao SDK not loaded");
      return;
    }

    const uuid = localStorage.getItem("uuid") || "anonymous";
    const shareUrl = `https://whoinside.vercel.app/?from=${uuid}&type=${
      result?.type
    }&nickname=${encodeURIComponent(nickname)}`;

    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `나의 감정 성향, 궁금하지 않아? ${nickname}과의 궁합도 확인해봐`,
          description: "나와 너의 감정 성향 우리 궁합은 얼마나 잘 맞을까? 👀",
          imageUrl: "https://whoinside.vercel.app/icon.png",
          link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
        },
        buttons: [
          {
            title: "나도 테스트하러 가기",
            link: { mobileWebUrl: shareUrl, webUrl: shareUrl },
          },
        ],
      });
    } catch (error) {
      console.error("Kakao share error:", error);
    }
  };

  // 1. 공유받지 않은 경우의 공유버튼 클릭 -> 닉네임 입력 -> 유저정보 저장 -> 카카오 공유
  const confirmNicknameAndShare = async (nicknameInput: string) => {
    const type = result?.type;
    setIsLoading(true);
    try {
      // 유저정보만 저장
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, nickname: nicknameInput, type }),
      });

      setNickname(nicknameInput);
      localStorage.setItem("myNickname", nicknameInput); // 닉네임을 localStorage에 저장
      closeModal();
      handleKakaoShare(nicknameInput);
    } catch (error) {
      console.error("Error saving user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 2. 공유받은 경우의 닉네임 입력 -> 유저정보 저장 + 관계정보 저장
  const confirmNickname = async (nicknameInput: string) => {
    const type = result?.type;
    const from = localStorage.getItem("from");
    const myUuid = localStorage.getItem("uuid");

    setIsLoading(true);
    try {
      // 유저정보 저장
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, nickname: nicknameInput, type }),
      });

      // 관계정보 저장
      if (from && myUuid) {
        await fetch("/api/relation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fromUuid: from, toUuid: myUuid }),
        });
      }

      setNickname(nicknameInput);
      localStorage.setItem("myNickname", nicknameInput); // 닉네임을 localStorage에 저장
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 공유받은 경우의 공유버튼 클릭 -> 카카오 공유만 실행
  const handleShare = () => {
    const from = localStorage.getItem("from");

    if (from) {
      // 공유받은 경우: 바로 카카오 공유
      handleKakaoShare(nickname);
    } else {
      // 공유받지 않은 경우: 닉네임 모달 표시
      setShowModal(true);
    }
  };

  // 컴포넌트 마운트 시 공유 여부 체크 및 초기 설정
  React.useEffect(() => {
    if (typeof window !== "undefined") {
      // UUID 생성
      const uuid = crypto.randomUUID();
      localStorage.setItem("uuid", uuid);

      // 결과 계산 및 설정
      const answers: string[] = [];
      for (let i = 1; i <= 10; i++) {
        const value = localStorage.getItem(`Q${i}`);
        if (value) answers.push(value);
      }
      if (answers.length === 10) {
        const { type, title, description, tmi, nickname, advice } =
          calculateResult(answers);
        setResult({ type, title, description, tmi, nickname, advice });
      }
    }
  }, []);

  // 공유받은 경우 fromInfo 설정
  React.useEffect(() => {
    const from = localStorage.getItem("from");
    const fromType = localStorage.getItem("fromType");
    const fromNickname = localStorage.getItem("fromNickname");
    const savedNickname = localStorage.getItem("myNickname"); // 저장된 닉네임 확인

    if (from && fromType && fromNickname && result) {
      setFromInfo({
        from,
        fromType,
        fromNickname: decodeURIComponent(fromNickname),
      });

      // 저장된 닉네임이 있으면 설정하고, 없으면 모달 표시
      if (savedNickname) {
        setNickname(savedNickname);
      } else {
        setShowModal(true);
      }

      // 궁합 정보 설정
      const myType = result.type;
      const matchKey = `${fromType}_${myType}`;
      const reverseMatchKey = `${myType}_${fromType}`;
      const comp =
        compatibilityDescriptions[
          matchKey as keyof typeof compatibilityDescriptions
        ] ||
        compatibilityDescriptions[
          reverseMatchKey as keyof typeof compatibilityDescriptions
        ];

      if (comp) {
        setCompatibility(comp);
      }
    }
  }, [result]);

  // 카카오 SDK 초기화를 위한 useEffect 추가
  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://developers.kakao.com/sdk/js/kakao.js";
    script.async = true;
    script.onload = () => {
      if (window.Kakao && !window.Kakao.isInitialized()) {
        window.Kakao.init("47e9e842805216474700f75e72891072");
      }
    };
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  if (!result)
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );

  const reaction = reactionGifs[result.type];

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      <Suspense>
        <SearchParamsHandler />
      </Suspense>
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl p-8 space-y-8"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center space-y-4"
          >
            <h1 className="text-[20px] font-bold text-gray-700">
              <span className="align-middle">당신의 감정 성향은:</span>
              <br />
              <motion.strong
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="text-4xl text-purple-600 inline-block mt-2"
              >
                {result.nickname}
              </motion.strong>
            </h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.5 }}
              className="text-purple-600 italic"
            >
              {result.tmi}
            </motion.p>
          </motion.div>

          {reaction && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="flex flex-col items-center gap-4"
            >
              <div className="relative w-full max-w-xs mx-auto">
                <div className="absolute inset-0 bg-purple-200 rounded-xl blur-xl opacity-20"></div>
                <Image
                  src={reaction.img}
                  alt="성향 반응 이미지"
                  width={0}
                  height={0}
                  sizes="100vw"
                  className="relative w-full rounded-xl shadow-lg hover:scale-105 transition-transform duration-300"
                  style={{ width: "auto", height: "auto" }}
                  priority
                />
              </div>
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="text-gray-700 text-lg text-center leading-relaxed"
          >
            {result.description}
          </motion.p>

          {/* ✨ 조언 카드 (배열형) */}
          {Array.isArray(result.advice) && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.8, duration: 0.5 }}
              className="mt-8 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 shadow-inner space-y-4"
            >
              <h3 className="text-2xl font-bold text-purple-700 text-center">
                ✨ 현실 조언 카드
              </h3>
              <ul className="list-none space-y-4">
                {result.advice.map((item: string, index: number) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 2 + index * 0.1, duration: 0.5 }}
                    className="flex items-start gap-3 text-gray-800 text-base leading-relaxed"
                  >
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-200 flex items-center justify-center text-purple-700 font-medium mt-0.5">
                      {index + 1}
                    </span>
                    <span className="flex-1">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* 공유자가 있다면 */}
          {fromInfo && compatibility && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 2.3, duration: 0.5 }}
              className="mt-10 p-6 rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 space-y-4"
            >
              <h2 className="text-xl text-center font-bold text-purple-700">
                {fromInfo.fromNickname}
                <span className="text-gray-500 font-normal text-lg">
                  님과의 궁합
                </span>
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 2.5, duration: 0.5 }}
                  className="text-2xl mt-2"
                >
                  &quot;{compatibility.title}&quot;
                </motion.div>
              </h2>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2.7, duration: 0.5 }}
                className="space-y-4"
              >
                <p className="text-center text-gray-800">
                  {compatibility.summary}
                </p>
                <div className="space-y-3 text-gray-700">
                  <div className="p-3 bg-white/50 rounded-lg">
                    <strong className="text-purple-600">잘 맞는 부분:</strong>{" "}
                    {compatibility.good}
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg">
                    <strong className="text-purple-600">주의할 점:</strong>{" "}
                    {compatibility.caution}
                  </div>
                  <div className="p-3 bg-white/50 rounded-lg">
                    <strong className="text-purple-600">조언:</strong>{" "}
                    {compatibility.advice}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* 공유 버튼 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="mt-12 space-y-6"
          >
            <div className="relative">
              <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 3.2, duration: 0.5, type: "spring" }}
                  className="bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg"
                >
                  Share with friends! ✨
                </motion.div>
              </div>
              <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-2xl p-8 space-y-4">
                <div className="text-center space-y-3">
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-purple-800">
                    친구들과 공유하기
                  </h3>
                  <div className="relative">
                    <div className="relative">
                      <p className="text-purple-600 font-medium bg-purple-50/80 px-6 py-3 rounded-xl inline-block shadow-sm">
                        카카오톡이나 링크로 공유해보세요! ✨
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center gap-6 mt-8">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outline"
                      onClick={() => {
                        if (!nickname) {
                          openModal();
                          return;
                        }
                        handleKakaoShare(nickname);
                      }}
                      className="relative bg-yellow-400 hover:bg-yellow-500 border-yellow-500 px-8 py-4 rounded-2xl group"
                    >
                      <div className="relative flex items-center gap-3">
                        <Image
                          src="/icon_kakao.png"
                          alt="카카오톡 공유"
                          width={40}
                          height={40}
                          className="transition-transform"
                          priority
                        />
                        <span className="text-[#3A1D1D] font-medium">
                          카카오톡 공유
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
                      onClick={() => {
                        const uuid =
                          localStorage.getItem("uuid") || "anonymous";
                        const shareUrl = `https://whoinside.vercel.app/?from=${uuid}&type=${
                          result?.type
                        }&nickname=${encodeURIComponent(nickname)}`;
                        navigator.clipboard.writeText(shareUrl);

                        // 복사 완료 토스트 메시지
                        const toast = document.createElement("div");
                        toast.className =
                          "fixed top-4 left-1/2 -translate-x-1/2 bg-black/80 text-white px-4 py-2 rounded-lg z-[9999]";
                        toast.textContent = "링크가 복사되었습니다";
                        document.body.appendChild(toast);
                        setTimeout(() => {
                          toast.remove();
                        }, 3000);
                      }}
                      className="relative bg-white hover:bg-purple-50 border-purple-200 px-8 py-4 rounded-2xl group"
                    >
                      <div className="relative flex items-center gap-3">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="40"
                          height="40"
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
                        <span className="text-purple-600 font-medium">
                          링크 복사
                        </span>
                      </div>
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* 다시 테스트하기와 이메일 입력 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4, duration: 0.5 }}
            className="mt-8 space-y-4"
          >
            <ResultActions
              uuid={uuid}
              type={result?.type}
              nickname={nickname}
            />
          </motion.div>
        </motion.div>
      </div>

      {showModal && (
        <NicknameModal
          isOpen={showModal}
          onClose={closeModal}
          onConfirm={fromInfo ? confirmNickname : confirmNicknameAndShare}
          isShared={!!fromInfo}
        />
      )}

      {/* 로딩 오버레이 */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] backdrop-blur-sm"
        >
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 min-w-[200px]">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">처리중입니다...</p>
          </div>
        </motion.div>
      )}
    </main>
  );
}
