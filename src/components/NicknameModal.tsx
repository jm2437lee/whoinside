import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nickname: string) => void;
  isShared?: boolean; // 공유 받은 상태인지 여부
}

export default function NicknameModal({
  isOpen,
  onClose,
  onConfirm,
  isShared = false, // 기본값은 false (공유하기 전 상태)
}: NicknameModalProps) {
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const validateNickname = (value: string) => {
    const regex = /^[가-힣a-zA-Z0-9]{2,10}$/;
    return regex.test(value);
  };

  const handleNicknameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNickname(value);

    if (value.length > 10) {
      setError("닉네임은 10자 이하여야 합니다.");
    } else if (value.length > 0 && !/^[가-힣a-zA-Z0-9]*$/.test(value)) {
      setError("완성형 한글, 영문, 숫자만 사용 가능합니다.");
    } else if (value.length > 0 && value.length < 2) {
      setError("닉네임은 2자 이상이어야 합니다.");
    } else {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (validateNickname(nickname.trim())) {
      onConfirm(nickname.trim());
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          닉네임 입력
        </h2>
        <p className="text-sm text-gray-500 text-center">
          친구가 알아볼 수 있는 닉네임을 입력해주세요.
          <br />
          <span className="text-xs text-purple-600">
            완성형 한글, 영문, 숫자로 2~10자 이내
          </span>
        </p>
        <div className="space-y-2">
          <input
            className="w-full border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
            placeholder="닉네임을 입력해주세요"
            value={nickname}
            onChange={handleNicknameChange}
            onKeyDown={(e) => {
              if (e.key === "Enter" && validateNickname(nickname.trim())) {
                handleSubmit();
              }
            }}
            maxLength={10}
          />
          {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
        </div>
        <div className="flex gap-4 justify-center">
          <Button
            onClick={handleSubmit}
            disabled={!validateNickname(nickname.trim())}
            className={`${
              !validateNickname(nickname.trim())
                ? "bg-gray-300 text-gray-500 cursor-not-allowed hover:bg-gray-300"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            {/* {isShared ? "입력하기" : "공유하기"} */}
            저장하기
          </Button>
        </div>
      </div>
    </div>
  );
}
