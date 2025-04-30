import { db } from "@/app/lib/db";
import { users, relations } from "@/app/lib/schema";
import { eq, inArray } from "drizzle-orm";
import { notFound } from "next/navigation";
import { MyPageContent } from "../_components/MyPageContent";
import { EmptyState } from "../_components/EmptyState";

interface MyPageProps {
  params: Promise<{ uuid: string }>;
}

// ✅ 추가
export const dynamic = "force-dynamic";

// ✅ 추가
export async function generateStaticParams() {
  return [];
}

export default async function MyPage({ params }: MyPageProps) {
  const { uuid } = await params;

  // 1. uuid 유효성 검사
  const myUser = await db.query.users.findFirst({
    where: eq(users.uuid, uuid),
  });

  if (!myUser) {
    return <EmptyState message="존재하지 않는 사용자입니다." />;
  }

  // 2. 이 uuid가 공유한 사람들(from_uuid = uuid)
  const sharedUsers = await db.query.relations.findMany({
    where: eq(relations.fromUuid, uuid),
  });

  console.log("~~~~~sharedUsers", sharedUsers);

  const toUuids = sharedUsers.map((relation) => relation.toUuid);
  console.log("~~~~~toUuids", toUuids);

  if (toUuids.length === 0) {
    return <MyPageContent nickname={myUser.nickname} connections={[]} />;
  }

  // 3. 공유 받은 사람들 정보 가져오기
  const connectedUsers = await db.query.users.findMany({
    where: (user) => inArray(user.uuid, toUuids),
  });

  const following = await db.query.relations.findMany({
    where: eq(relations.toUuid, uuid),
  });

  return (
    <MyPageContent
      nickname={myUser.nickname}
      connections={connectedUsers.map((user) => ({
        nickname: user.nickname,
        type: user.type,
      }))}
    />
  );
}
