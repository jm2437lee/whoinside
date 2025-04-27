import { useState } from "react";
import { Button } from "@/components/ui/button";

interface NicknameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (nickname: string) => void;
}

export default function NicknameModal({
  isOpen,
  onClose,
  onConfirm,
}: NicknameModalProps) {
  const [nickname, setNickname] = useState("");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-8 w-full max-w-sm space-y-4">
        <h2 className="text-2xl font-bold text-center text-gray-800">
          닉네임 입력
        </h2>
        <input
          className="w-full border rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-purple-400"
          placeholder="당신의 닉네임을 입력하세요"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <div className="flex gap-4 justify-center">
          <Button variant="outline" onClick={onClose}>
            취소
          </Button>
          <Button
            onClick={() => {
              if (nickname.trim()) {
                onConfirm(nickname.trim());
              }
            }}
          >
            공유하기
          </Button>
        </div>
      </div>
    </div>
  );
}
