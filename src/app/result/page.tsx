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
// import { useSearchParams } from "next/navigation";
import compatibilityDescriptions from "@/data/compatibilityDescriptions.json";
import Image from "next/image";
import { Suspense } from "react";
import { SearchParamsHandler } from "@/components/SearchParamsHandler";

const reactionGifs: Record<string, { img: string; quote: string }> = {
  A1: {
    img: "/gifs/a1.png",
    quote: "감정은 사소해도 치명적... 머릿속에서 떠나지 않아🥺",
  },
  A2: {
    img: "/gifs/a2.png",
    quote: "혼자 조용히 넘기려 했지만... 마음속 파도는 여전해🌊",
  },
  B1: {
    img: "/gifs/b1.png",
    quote: "감정이 복잡할 땐 거리두기! 피하면 편해요✌️",
  },
  B2: {
    img: "/gifs/b2.png",
    quote: "갈등은 끊어내는 게 제일 깔끔하죠🔪",
  },
  C1: {
    img: "/gifs/c1.png",
    quote: "감정보다 이성이 먼저! 공감보다 논리🧠",
  },
  C2: {
    img: "/gifs/c2.png",
    quote: "쿨한 무심함. 감정? 신경 안 씀😎",
  },
  D1: {
    img: "/gifs/d1.png",
    quote: "말 안 하면 터져요! 지금 바로 표현하는 편🔥",
  },
  D2: {
    img: "/gifs/d2.png",
    quote: "참다가 폭발! 그동안 쌓인 감정이 퐁!💥",
  },
};

export default function ResultPage() {
  // const searchParams = useSearchParams();
  const [result, setResult] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [fromInfo, setFromInfo] = React.useState<{
    from: string;
    fromType: string;
    fromNickname: string;
  } | null>(null);
  const [compatibility, setCompatibility] = React.useState<any>(null);

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleKakaoShare = (nickname: string) => {
    const uuid = localStorage.getItem("uuid") || "anonymous";
    // const shareUrl = `https://whoinside.vercel.app/?from=${uuid}&type=${
    //   result?.type
    // }&nickname=${encodeURIComponent(nickname)}`;
    const shareUrl = `http://localhost:3000/?from=${uuid}&type=${
      result?.type
    }&nickname=${encodeURIComponent(nickname)}`;

    if (window.Kakao) {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `나의 감정 성향, 궁금하지 않아? ${nickname}과의 궁합도 확인해봐`,
          description: "나와 너의 감정 성향 우리 궁합은 얼마나 잘 맞을까? 👀",
          imageUrl: "https://yourdomain.com/static/og-image.jpg", // 썸네일 이미지
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
      });
    }
  };

  React.useEffect(() => {
    // 2. 카카오 SDK 초기화
    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init("47e9e842805216474700f75e72891072"); // ✅ 발급받은 키로 교체
    }
    // 1. uuid 준비
    let uuid = localStorage.getItem("uuid");
    if (!uuid) {
      uuid = crypto.randomUUID();
      localStorage.setItem("uuid", uuid);
    }

    // 3. 나의 결과 계산
    const answers: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const value = localStorage.getItem(`Q${i}`);
      if (value) answers.push(value);
    }
    if (answers.length === 10) {
      const { type, title, description, tmi, nickname } =
        calculateResult(answers);

      setResult({
        type,
        title,
        description,
        tmi,
        nickname,
      });
    }
  }, []);

  React.useEffect(() => {
    // 공유자 정보 가져오기
    const from = localStorage.getItem("from");
    const fromType = localStorage.getItem("fromType");
    const fromNickname = localStorage.getItem("fromNickname");

    if (from && fromType && fromNickname) {
      setFromInfo({
        from: from,
        fromType,
        fromNickname: decodeURIComponent(fromNickname),
      });

      // 궁합 찾기
      if (result) {
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
    }
  }, [result]);

  if (!result)
    return <div className="text-center py-20">결과를 불러오는 중...1</div>;

  const reaction = reactionGifs[result.type];

  const confirmNicknameAndShare = (nicknameInput: string) => {
    closeModal();
    setTimeout(() => {
      // localStorage.setItem("nickname", nicknameInput);
      handleKakaoShare(nicknameInput);
    }, 200); // 살짝 딜레이 줘서 자연스럽게
  };

  return (
    <>
      <Suspense fallback={null}>
        <SearchParamsHandler />
      </Suspense>
      <Script
        src="https://developers.kakao.com/sdk/js/kakao.js"
        strategy="beforeInteractive"
      />
      <div className="min-h-screen flex flex-col justify-center items-center px-6 py-10">
        <div className="max-w-xl w-full space-y-6">
          <h1 className="text-[20px] font-bold text-center text-gray-700 font-normal ">
            <span className="align-middle">당신의 감정 성향은: </span>
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
              {/* <p className="text-center text-purple-700 font-semibold">
    {reaction.quote}
  </p> */}
            </div>
          )}
          <p className="text-gray-700 text-lg text-center">
            {result.description}
          </p>

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

          <p className="text-center flex justify-center">
            <KakaoShareButton onClick={openModal} />
          </p>

          <ResultActions />
        </div>
      </div>

      {/* 모달 삽입 */}
      <NicknameModal
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={confirmNicknameAndShare}
      />
    </>
  );
}
