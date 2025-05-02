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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          이름 입력
        </h2>
        <input
          className="w-full border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="이름을 입력해주세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (nickname.trim()) {
                onConfirm(nickname.trim());
              }
            }
          }}
        />
        <div className="flex gap-4 justify-center">
          <Button
            onClick={() => {
              if (nickname.trim()) {
                onConfirm(nickname.trim());
              }
            }}
          >
            {isShared ? "입력하기" : "공유하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
