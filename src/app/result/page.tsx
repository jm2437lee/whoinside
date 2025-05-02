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
          imageUrl: "/whoinside.png",
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

    if (from && fromType && fromNickname && result) {
      setFromInfo({
        from,
        fromType,
        fromNickname: decodeURIComponent(fromNickname),
      });

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

      // 공유받은 경우에만 바로 닉네임 모달 표시
      setShowModal(true);
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
    return <div className="text-center py-20">결과를 불러오는 중...</div>;

  const reaction = reactionGifs[result.type];

  return (
    <main>
      <Suspense>
        <SearchParamsHandler />
      </Suspense>
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-10">
        <div className="max-w-xl w-full space-y-6">
          <h1 className="text-[20px] font-bold text-center text-gray-700 font-normal ">
            <span className="align-middle">당신의 감정 성향은: </span>
            <br />
            <strong className="text-purple-600 text-4xl align-middle">
              {result.nickname}
            </strong>
          </h1>
          <p className="mt-4 text-purple-600 italic text-center ">
            {result.tmi}
          </p>
          {reaction && (
            <div className="flex flex-col items-center gap-4">
              <Image
                src={reaction.img}
                alt="성향 반응 이미지"
                width={0}
                height={0}
                sizes="100vw"
                className="w-full max-w-xs rounded-xl shadow-md"
                style={{ width: "auto", height: "auto" }}
              />
            </div>
          )}
          <p className="text-gray-700 text-lg text-center">
            {result.description}
          </p>
          <div className="text-left mt-4 space-y-2 text-gray-700">
            {/* ✨ 조언 카드 (배열형) */}
            {Array.isArray(result.advice) && (
              <div className="mt-8 p-6 rounded-xl bg-purple-50 shadow-inner space-y-4">
                <h3 className="text-2xl font-bold text-purple-700 text-center">
                  ✨ 현실 조언 카드
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-800 text-base leading-relaxed">
                  {result.advice.map((item: string, index: number) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* 공유자가 있다면 */}
          {fromInfo && (
            <div className="mt-10 p-6 rounded-xl border bg-gray-50 space-y-4">
              <h2 className="text-xl text-center font-bold text-purple-700">
                {fromInfo.fromNickname}
                <span className="text-gray-500 font-normal text-lg">
                  님과의 궁합
                </span>
                <div>&quot;{compatibility?.title}&quot;</div>
              </h2>
              {compatibility ? (
                <>
                  <p className="text-center text-gray-800">
                    {compatibility.summary}
                  </p>
                  <div className="text-left mt-4 space-y-2 text-gray-700">
                    <div>
                      <strong>잘 맞는 부분:</strong> {compatibility.good}
                    </div>
                    <div>
                      <strong>주의할 점:</strong> {compatibility.caution}
                    </div>
                    <div>
                      <strong>조언:</strong> {compatibility.advice}
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">
                  궁합 정보를 찾을 수 없습니다.
                </p>
              )}
            </div>
          )}

          {/* 공유 버튼 */}
          <p className="text-center flex justify-center m-0">
            <KakaoShareButton onClick={handleShare} />
          </p>
          <p className="text-center flex justify-center m-0">
            {uuid && (
              <a
                href={`/me/${uuid}`}
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700"
              >
                <Users size={20} />
                공유한 친구와 궁합 보기
              </a>
            )}
          </p>

          {/* 다시 테스트하기와 이메일 입력 섹션 */}
          <div className="mt-8 space-y-4">
            <ResultActions
              uuid={uuid}
              type={result?.type}
              nickname={nickname}
            />
          </div>
        </div>
      </div>
      {showModal && (
        <NicknameModal
          isOpen={showModal}
          onClose={closeModal}
          onConfirm={fromInfo ? confirmNickname : confirmNicknameAndShare}
          isShared={!!fromInfo}
        />
      )}
      {/* 로딩 오버레이 - z-index를 9999로 설정하여 최상단에 표시 */}
      {isLoading && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-xl shadow-xl p-6 flex flex-col items-center gap-4 min-w-[200px]">
            <div className="w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-700 font-medium">처리중입니다...</p>
          </div>
        </div>
      )}
    </main>
  );
}
