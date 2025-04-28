interface MyPageContentProps {
  nickname: string;
  connections: {
    nickname: string;
    type: string;
  }[];
}

export function MyPageContent({ nickname, connections }: MyPageContentProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-10 px-6">
      <div className="max-w-3xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-center text-purple-700">
          {nickname}님의 연결된 친구들
        </h1>

        {connections.length === 0 ? (
          <p className="text-center text-gray-600 mt-10">
            아직 공유를 통해 들어온 친구가 없습니다.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            {connections.map((connection, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg border border-purple-100 transition"
              >
                <h2 className="text-xl font-semibold text-purple-600">
                  {connection.nickname}
                </h2>
                <p className="text-gray-700 mt-2">
                  감정 성향: <strong>{connection.type}</strong>
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
