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
import { Users } from "lucide-react"; // 아이콘 라이브러리 사용

const reactionGifs: Record<string, { img: string }> = {
  A1: {
    img: "/gifs/a1.png",
  },
  A2: {
    img: "/gifs/a2.png",
  },
  B1: {
    img: "/gifs/b1.png",
  },
  B2: {
    img: "/gifs/b2.png",
  },
  C1: {
    img: "/gifs/c1.png",
  },
  C2: {
    img: "/gifs/c2.png",
  },
  D1: {
    img: "/gifs/d1.png",
  },
  D2: {
    img: "/gifs/d2.png",
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
  const [nickname, setNickname] = React.useState("");

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  const uuid =
    typeof window !== "undefined" ? localStorage.getItem("uuid") : null;

  const handleKakaoShare = (nickname: string) => {
    const uuid = localStorage.getItem("uuid") || "anonymous";
    const shareUrl = `https://whoinside.vercel.app/?from=${uuid}&type=${
      result?.type
    }&nickname=${encodeURIComponent(nickname)}`;
    // const shareUrl = `http://localhost:3000/?from=${uuid}&type=${
    //   result?.type
    // }&nickname=${encodeURIComponent(nickname)}`;

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
    const uuid = crypto.randomUUID();
    localStorage.setItem("uuid", uuid);

    // 3. 나의 결과 계산
    const answers: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const value = localStorage.getItem(`Q${i}`);
      if (value) answers.push(value);
    }
    if (answers.length === 10) {
      const { type, title, description, tmi, nickname, advice } =
        calculateResult(answers);

      setResult({
        type,
        title,
        description,
        tmi,
        nickname,
        advice,
      });
    }
  }, []);

  React.useEffect(() => {
    // 공유자 정보 가져오기
    const from = localStorage.getItem("from");
    const fromType = localStorage.getItem("fromType");
    const fromNickname = localStorage.getItem("fromNickname");

    if (from && fromType && fromNickname) {
      setShowModal(true);
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

        // ✅ save-relation API 호출 추가
        const myUuid = localStorage.getItem("uuid");

        if (from && myUuid) {
          const relationSaved = localStorage.getItem("relationSaved");

          // ✅ relation 저장 안했을 때만 호출
          if (!relationSaved) {
            fetch("/api/relation", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ fromUuid: from, toUuid: myUuid }),
            }).then(() => {
              // 저장 완료 후 relationSaved 플래그 남기기
              localStorage.setItem("relationSaved", "true");
            });
          }
          if (!nickname) {
            setShowModal(true);
          }
        }
      }
    }
  }, [result]);

  if (!result)
    return <div className="text-center py-20">결과를 불러오는 중...</div>;

  const reaction = reactionGifs[result.type];

  const confirmNicknameAndShare = async (nicknameInput: string) => {
    closeModal();

    handleKakaoShare(nicknameInput);

    const uuid = localStorage.getItem("uuid");
    const type = result?.type;

    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, nickname: nicknameInput, type }),
    });
  };

  const confirmNickname = async (nicknameInput: string) => {
    closeModal();
    const type = result?.type;

    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, nickname: nicknameInput, type }),
    });
    setNickname(nicknameInput);
  };

  const confirmOnlyShare = async () => {
    handleKakaoShare(nickname);
    const type = result?.type;

    await fetch("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ uuid, nickname, type }),
    });
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

          <p className="text-center flex justify-center m-0">
            <KakaoShareButton
              onClick={fromInfo && nickname ? confirmOnlyShare : openModal}
            />
          </p>
          <p className="text-center flex justify-center m-0">
            {uuid && (
              <a
                href={`/me/${uuid}`}
                className="mt-4 inline-flex items-center gap-2 rounded-lg bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition"
              >
                <Users className="w-5 h-5" />
                마이페이지로 가기
              </a>
            )}
          </p>

          <ResultActions />
        </div>
      </div>

      {/* 모달 삽입 */}
      <NicknameModal
        isOpen={showModal}
        onClose={closeModal}
        onConfirm={
          !fromInfo
            ? confirmNicknameAndShare
            : !nickname
            ? confirmNickname
            : () => {}
        }
      />
    </>
  );
}
