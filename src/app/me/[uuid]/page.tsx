import { db } from "@/app/lib/db";
import { users, relations } from "@/app/lib/schema";
import { eq, desc } from "drizzle-orm";
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

interface Connection {
  nickname: string;
  type: string;
}

export default async function MyPage({ params }: MyPageProps) {
  const { uuid } = await params;

  // 1. 내 정보 조회
  const myInfo = await db.query.users.findFirst({
    where: eq(users.uuid, uuid),
  });

  if (!myInfo) {
    notFound();
  }

  // 2. 이 uuid가 공유한 사람들과의 관계 정보 조회 (최신순)
  const connections = await db
    .select({
      nickname: users.nickname,
      type: users.type,
    })
    .from(relations)
    .where(eq(relations.fromUuid, uuid))
    .innerJoin(users, eq(relations.toUuid, users.uuid))
    .orderBy(desc(relations.createdAt));

  return (
    <MyPageContent
      myType={myInfo.type}
      nickname={myInfo.nickname}
      email={myInfo.email}
      uuid={uuid}
      connections={connections}
      isPaid={myInfo.is_paid === 1}
    />
  );
}
