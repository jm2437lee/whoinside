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
import Link from "next/link";
import { Copy, Check } from "lucide-react";

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

// 기존 이미지를 표시하되 길게 누르면 카드 이미지를 다운로드하는 컴포넌트
function ImageWithCardDownload({
  originalImageSrc,
  type,
  nickname,
}: {
  originalImageSrc: string;
  type: string;
  nickname: string;
}) {
  const [isPressed, setIsPressed] = React.useState(false);
  const [pressTimer, setPressTimer] = React.useState<NodeJS.Timeout | null>(
    null
  );
  const [isMobile, setIsMobile] = React.useState(false);

  const cardImageUrl = `/card-images/${type.toLowerCase()}.png`;

  React.useEffect(() => {
    // 모바일 디바이스 감지
    const checkMobile = () => {
      const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(
        navigator.userAgent
      );
      setIsMobile(isMobileDevice);
    };

    checkMobile();
  }, []);

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

  const downloadCardImage = () => {
    try {
      // 먼저 직접 다운로드 시도
      const link = document.createElement("a");
      link.href = cardImageUrl;
      link.download = `${nickname}_감정성향카드.png`;

      // 사용자 제스처 컨텍스트에서 실행
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      openToast("카드 이미지 다운로드를 시작합니다! 📌");
    } catch (error) {
      console.error("Direct download failed:", error);

      // 폴백: 새 창에서 열기
      try {
        const newWindow = window.open(cardImageUrl, "_blank");
        if (newWindow) {
          newWindow.focus();
          openToast("새 창에서 이미지를 우클릭하여 저장해주세요! 📌");
        } else {
          // 팝업 차단된 경우
          openToast(
            "브라우저에서 팝업이 차단되었습니다. 팝업을 허용하거나 직접 카드 이미지를 우클릭하여 저장해주세요."
          );
        }
      } catch (fallbackError) {
        console.error("Fallback failed:", fallbackError);
        openToast("다운로드에 실패했습니다. 새로고침 후 다시 시도해주세요.");
      }
    }
  };

  const handleTouchStart = () => {
    setIsPressed(true);
    const timer = setTimeout(() => {
      downloadCardImage();
      setIsPressed(false);
    }, 800); // 0.8초 길게 누르기
    setPressTimer(timer);
  };

  const handleTouchEnd = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleMouseDown = () => {
    if (isMobile) {
      // 모바일에서는 길게 누르기
      setIsPressed(true);
      const timer = setTimeout(() => {
        downloadCardImage();
        setIsPressed(false);
      }, 800); // 0.8초 길게 누르기
      setPressTimer(timer);
    }
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (pressTimer) {
      clearTimeout(pressTimer);
      setPressTimer(null);
    }
  };

  const handleClick = () => {
    if (!isMobile) {
      // 웹에서는 클릭으로 바로 다운로드
      downloadCardImage();
    }
  };

  return (
    <div className="relative">
      <Image
        src={originalImageSrc}
        alt="성향 반응 이미지"
        width={300}
        height={300}
        className={`relative rounded-xl shadow-lg hover:scale-105 transition-all duration-300 select-none cursor-pointer ${
          isPressed ? "scale-95 brightness-90" : ""
        }`}
        priority
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onClick={handleClick}
        draggable={false}
      />

      {/* 오버레이 텍스트 */}
      <div className="absolute left-0 right-0 bottom-3 left-1/2 -translate-x-1/2 bg-black/70 text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg backdrop-blur-sm w-full">
        📌{" "}
        {isMobile
          ? "이미지를 길게 눌러 저장하고 공유해보세요"
          : "이미지를 클릭해서 저장하고 공유해보세요"}
      </div>

      {/* 길게 누르기 인디케이터 */}
      {isPressed && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl">
          <div className="bg-white/90 rounded-full p-3 shadow-lg">
            <div className="w-6 h-6 border-3 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      )}
    </div>
  );
}

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
  const [userCount, setUserCount] = React.useState(0);
  const [isCopied, setIsCopied] = React.useState(false);

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
    const shareUrl = `${
      process.env.NEXT_PUBLIC_DOMAIN_URL
    }/?from=${uuid}&type=${result?.type}&nickname=${encodeURIComponent(
      nickname
    )}`;
    const imageUrl =
      "https://k.kakaocdn.net/14/dn/btsNLud86iV/AGBAQzr2QTze43Zd46Z3Bk/o.jpg";

    console.log("Result page sharing details:", {
      domain: process.env.NEXT_PUBLIC_DOMAIN_URL,
      uuid,
      type: result?.type,
      nickname,
      fullUrl: shareUrl,
      localStorage:
        typeof window !== "undefined"
          ? Object.keys(localStorage)
          : "not available",
    });

    try {
      window.Kakao.Share.sendDefault({
        objectType: "feed",
        content: {
          title: `나의 감정 성향, 궁금하지 않아? ${nickname}과의 궁합도 확인해봐`,
          description: "나와 너의 감정 성향 우리 궁합은 얼마나 잘 맞을까? 👀",
          imageUrl,
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

  const handleShare = (type: "kakao" | "link" | "twitter" | "instagram") => {
    // 닉네임이 이미 설정되어 있다고 가정 (페이지 로드시 받음)
    const uuid = localStorage.getItem("uuid") || "anonymous";
    const shareUrl = `${
      process.env.NEXT_PUBLIC_DOMAIN_URL
    }/?from=${uuid}&type=${result?.type}&nickname=${encodeURIComponent(
      nickname
    )}`;

    switch (type) {
      case "kakao":
        handleKakaoShare(nickname);
        break;
      case "link":
        navigator.clipboard.writeText(shareUrl);
        openToast("링크가 복사되었습니다");
        break;
      case "twitter":
        const twitterText = `나의 감정 성향: ${result.nickname}\n${result.tmi}\n\n친구들과 궁합을 확인해보세요!`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(
            twitterText
          )}&url=${encodeURIComponent(shareUrl)}`,
          "_blank"
        );
        break;
      case "instagram":
        // 모바일 기기 체크
        const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        if (isMobile) {
          // 모바일에서는 Instagram 앱으로 이동 시도
          window.location.href = `instagram://story-camera`;

          // 앱이 실행되지 않을 경우를 대비해 시간 지연 후 알림
          setTimeout(() => {
            alert(
              "Instagram 앱이 필요합니다. 링크를 복사하여 직접 공유해주세요."
            );
            navigator.clipboard.writeText(shareUrl);
            openToast("링크가 복사되었습니다");
          }, 500);
        } else {
          // 데스크톱에서는 바로 알림
          alert(
            "Instagram 공유는 모바일 앱에서만 가능합니다. 링크를 복사하여 직접 공유해주세요."
          );
          navigator.clipboard.writeText(shareUrl);
          openToast("링크가 복사되었습니다");
        }
        break;
    }
  };

  // 닉네임 입력 완료 시 사용자 정보 저장
  const confirmNickname = async (nicknameInput: string) => {
    const type = result?.type;
    const from = localStorage.getItem("from");
    const myUuid = localStorage.getItem("uuid");

    setIsLoading(true);
    try {
      // 유저정보 저장 (항상 실행)
      await fetch("/api/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid: myUuid, nickname: nicknameInput, type }),
      });

      // 공유받은 경우에만 관계정보 저장
      if (from && myUuid) {
        await fetch("/api/relation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fromUuid: from,
            toUuid: myUuid,
            myNickname: nicknameInput,
          }),
        });
      }

      setNickname(nicknameInput);
      localStorage.setItem("myNickname", nicknameInput);
      closeModal();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyUrl = async () => {
    const myPageUrl = `${process.env.NEXT_PUBLIC_DOMAIN_URL || ""}/me/${uuid}`;

    // 1차 시도: Modern Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(myPageUrl);
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
      textArea.value = myPageUrl;
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
      const result = prompt("아래 URL을 길게 누르고 복사해주세요:", myPageUrl);
      if (result === null) {
        // 사용자가 취소하지 않았다면 복사된 것으로 간주
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }
    } else {
      // 데스크톱에서는 alert로 URL 제공
      alert(`URL 복사에 실패했습니다. 직접 복사해주세요:\n${myPageUrl}`);
    }
  };

  // 컴포넌트 마운트 시 공유 여부 체크 및 초기 설정
  React.useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await fetch("/api/users/count");
        const data = await response.json();
        if (data.success) {
          setUserCount(Math.floor(data.count));
        }
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    if (typeof window !== "undefined") {
      fetchUserCount();
      // UUID 체크 - 없을 때만 새로 생성
      const existingUuid = localStorage.getItem("uuid");
      if (!existingUuid) {
        const newUuid = crypto.randomUUID();
        localStorage.setItem("uuid", newUuid);
      }

      // 답변 체크
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

  // 결과 로드 후 닉네임 처리
  React.useEffect(() => {
    if (result && typeof window !== "undefined") {
      const savedNickname = localStorage.getItem("myNickname");

      if (savedNickname) {
        // 이미 저장된 닉네임이 있으면 설정
        setNickname(savedNickname);
      } else {
        // 닉네임이 없으면 바로 모달 표시
        setShowModal(true);
      }
    }
  }, [result]);

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

  React.useEffect(() => {
    if (typeof window !== "undefined" && result) {
      // 동적으로 메타 태그 업데이트
      const updateMetaTags = () => {
        const title = `${result.nickname} - 감정 성향 테스트 결과`;
        const description = `${result.tmi} | 나와 너의 감정 성향 궁합은 얼마나 잘 맞을까? 👀`;

        // 기존 메타 태그 업데이트
        document.title = title;

        // OpenGraph 메타 태그 업데이트
        const metaTags = {
          "og:title": title,
          "og:description": description,
          "og:image": `${process.env.NEXT_PUBLIC_DOMAIN_URL}/main.png`,
          "og:url": window.location.href,
          "twitter:title": title,
          "twitter:description": description,
          "twitter:image": `${process.env.NEXT_PUBLIC_DOMAIN_URL}/main.png`,
        };

        Object.entries(metaTags).forEach(([property, content]) => {
          let meta = document.querySelector(`meta[property="${property}"]`);
          if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("property", property);
            document.head.appendChild(meta);
          }
          meta.setAttribute("content", content);
        });
      };

      updateMetaTags();
    }
  }, [result]);

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
              <div className="relative w-full max-w-xs mx-auto flex justify-center">
                <div className="absolute inset-0 bg-purple-200 rounded-xl blur-xl opacity-20"></div>
                <ImageWithCardDownload
                  originalImageSrc={reaction.img}
                  type={result?.type}
                  nickname={result?.nickname}
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

          {/* URL 저장 안내 */}
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
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
                  onClick={copyUrl}
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
          </div>
          {/* 마이페이지 바로가기 버튼 (항상 노출) */}
          <Link href={`${process.env.NEXT_PUBLIC_DOMAIN_URL || ""}/me/${uuid}`}>
            <motion.button
              whileHover={{
                scale: 1.02,
                boxShadow: "0 10px 25px -5px rgba(249, 115, 22, 0.4)",
              }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold py-5 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl mb-6 border-2 border-orange-400/30 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-50"></div>
              <div className="relative flex items-center justify-center gap-2">
                <span className="text-lg">🏠</span>
                <span className="text-base">마이페이지로 바로가기</span>
              </div>
            </motion.button>
          </Link>

          {/* 다시 테스트하기와 이메일 입력 섹션 */}
          {/* <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.4, duration: 0.5 }}
            className="mt-8 space-y-4"
          >
            <div className="text-center space-y-6">
              <div className="space-y-3">
                <div className="bg-purple-50 rounded-lg p-2 inline-block mx-auto">
                  <p className="text-sm font-medium text-purple-700">
                    🎉 현재{" "}
                    <span className="text-lg font-bold text-purple-600">
                      {userCount}명
                    </span>
                    이 리포트를 받아보았어요!
                  </p>
                </div>
                <h3 className="text-xl font-bold text-purple-700">
                  이메일 입력 후 리포트 즉시 받기 🎁
                </h3>
                <div className="max-w-md mx-auto">
                  <div className="bg-white rounded-xl p-4 shadow-sm space-y-3 mb-4">
                    <p className="font-medium text-purple-700">
                      지금 당신에게 딱 맞는 심화 리포트가 준비됐어요!
                    </p>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-500">✨</span>
                        <span>지금 입력하면 즉시 PDF 다운로드 가능!</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-500">📊</span>
                        <span>
                          &quot;당신과 잘 맞는 유형은 누구?&quot; 상성 분석 포함
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-500">📊</span>
                        <span>내 유형의 감정 대응법과 관계 팁 5가지</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 shadow-sm space-y-3">
                    <p className="font-medium text-purple-700">
                      친구가 참여할 때마다
                    </p>
                    <div className="space-y-2 text-left">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-500">💝</span>
                        <span>실시간 궁합 알림</span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="text-purple-500">⭐️</span>
                        <span>친구와의 상성 분석</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <ResultActions
              uuid={uuid}
              type={result?.type}
              nickname={nickname}
            />
          </motion.div> */}

          {/* 공유 버튼 섹션 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.5 }}
            className="mt-12 space-y-6"
          >
            <div className="relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 3.2, duration: 0.5, type: "spring" }}
                  className="whitespace-nowrap bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium shadow-lg"
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
                        SNS나 링크로 공유해보세요! ✨
                      </p>
                    </div>
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
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
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
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
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
              </div>
            </div>
            <button
              onClick={() => {
                // Q1~Q10 로컬 스토리지 데이터 삭제
                for (let i = 1; i <= 10; i++) {
                  localStorage.removeItem(`Q${i}`);
                }
                // 퀴즈 시작 페이지로 이동
                window.location.href = "/quiz/q1";
              }}
              className="w-full bg-gray-200 hover:bg-gray-300 text-black font-medium py-3 rounded-xl"
            >
              🔄 다시 테스트하기
            </button>
          </motion.div>
        </motion.div>
      </div>

      {showModal && (
        <NicknameModal
          isOpen={showModal}
          onClose={closeModal}
          onConfirm={confirmNickname}
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
