import { Users } from "lucide-react";
import compatibilityDescriptions from "@/data/compatibilityDescriptions.json";

interface MyPageContentProps {
  myType: string;
  nickname: string;
  connections: {
    nickname: string;
    type: string;
  }[];
}

export function MyPageContent({
  myType,
  nickname,
  connections,
}: MyPageContentProps) {
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-10 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <div className="flex items-center justify-center gap-2 text-purple-600">
          <Users size={24} />
          <h1 className="text-3xl font-bold text-center">
            공유한 친구들과의 궁합
          </h1>
        </div>

        {connections.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">
            아직 공유를 통해 들어온 친구가 없습니다.
          </p>
        ) : (
          <div className="space-y-8">
            {connections.map((connection, index) => {
              const compatibility = getCompatibility(myType, connection.type);
              if (!compatibility) return null;

              return (
                <div
                  key={index}
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
                    <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                      <h3 className="flex items-center gap-2 font-bold text-green-700 mb-2">
                        <span className="text-xl">👍</span> 잘 맞는 부분
                      </h3>
                      <p className="text-gray-700">{compatibility.good}</p>
                    </div>

                    {/* 주의할 점 */}
                    <div className="p-4 bg-red-50 rounded-lg border border-red-100">
                      <h3 className="flex items-center gap-2 font-bold text-red-700 mb-2">
                        <span className="text-xl">⚠️</span> 주의할 점
                      </h3>
                      <p className="text-gray-700">{compatibility.caution}</p>
                    </div>

                    {/* 조언 */}
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-100">
                      <h3 className="flex items-center gap-2 font-bold text-purple-700 mb-2">
                        <span className="text-xl">💡</span> 조언
                      </h3>
                      <p className="text-gray-700">{compatibility.advice}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
