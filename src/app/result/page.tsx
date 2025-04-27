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

const reactionGifs: Record<string, { img: string; quote: string }> = {
  A1: {
    img: "/gifs/a1.jpg",
    quote: "감정은 사소해도 치명적... 머릿속에서 떠나지 않아🥺",
  },
  A2: {
    img: "/gifs/a2.jpg",
    quote: "혼자 조용히 넘기려 했지만... 마음속 파도는 여전해🌊",
  },
  B1: {
    img: "/gifs/b1.jpg",
    quote: "감정이 복잡할 땐 거리두기! 피하면 편해요✌️",
  },
  B2: {
    img: "/gifs/a1.jpg",
    quote: "갈등은 끊어내는 게 제일 깔끔하죠🔪",
  },
  C1: {
    img: "/gifs/b1.jpg",
    quote: "감정보다 이성이 먼저! 공감보다 논리🧠",
  },
  C2: {
    img: "/gifs/a2.jpg",
    quote: "쿨한 무심함. 감정? 신경 안 씀😎",
  },
  D1: {
    img: "/gifs/a1.jpg",
    quote: "말 안 하면 터져요! 지금 바로 표현하는 편🔥",
  },
  D2: {
    img: "/gifs/b1.jpg",
    quote: "참다가 폭발! 그동안 쌓인 감정이 퐁!💥",
  },
};

export default function ResultPage() {
  const [result, setResult] = React.useState<any>(null);
  const [showModal, setShowModal] = React.useState(false);
  const [nickname, setNickname] = React.useState(""); // 입력된 닉네임

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const handleKakaoShare = () => {
    const uuid = localStorage.getItem("uuid") || "anonymous";
    const shareUrl = `https://whoinside.vercel.app/?from=${uuid}`;

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
    const uuid = localStorage.getItem("uuid") || crypto.randomUUID();
    localStorage.setItem("uuid", uuid);

    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init("47e9e842805216474700f75e72891072"); // ✅ 발급받은 키로 교체
    }

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

    if (
      typeof window !== "undefined" &&
      window.Kakao &&
      !window.Kakao.isInitialized()
    ) {
      window.Kakao.init("47e9e842805216474700f75e72891072"); // 👉 발급받은 JS 키로 교체
    }
  }, []);

  if (!result)
    return <div className="text-center py-20">결과를 불러오는 중...1</div>;

  const reaction = reactionGifs[result.type];

  const confirmNicknameAndShare = (nicknameInput: string) => {
    setNickname(nicknameInput);
    localStorage.setItem("nickname", nicknameInput);
    closeModal();
    setTimeout(() => {
      handleKakaoShare();
    }, 200); // 살짝 딜레이 줘서 자연스럽게
  };

  return (
    <>
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
              <img
                src={reaction.img}
                alt="성향 반응 이미지"
                className="w-full max-w-xs rounded-xl shadow-md"
              />
              {/* <p className="text-center text-purple-700 font-semibold">
    {reaction.quote}
  </p> */}
            </div>
          )}
          <p className="text-gray-700 text-lg text-center">
            {result.description}
          </p>

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
