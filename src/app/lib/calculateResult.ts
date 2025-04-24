// lib/calculateResult.ts (수정된 결과 로직)

const typeDescriptions = {
  A1: {
    title: "과민 내성형",
    description:
      "감정에 매우 민감하고 쉽게 상처받으며, 사소한 일도 오래 곱씹는 편입니다. 자책을 자주 하며, 타인의 시선에 예민합니다.",
    tmi: "기분 나쁜 날엔 일단 씻고 누움. 말은 못 해도 마음속으로는 100줄 다 썼음.",
  },
  A2: {
    title: "방어형 내성",
    description:
      "속으로 감정을 삼키며 티 내지 않으려 합니다. 표현 대신 회피하거나 혼자 삭이며, 조용히 물러나는 경향이 강합니다.",
    tmi: "아무 일 없는 척 잘함. 근데 밤에 불 끄면 눈물 나옴. 이불과 대화함.",
  },
  B1: {
    title: "거리두기형 회피",
    description:
      "감정적으로 불편한 상황을 피하려는 경향이 있습니다. 문제를 정면으로 마주하기보다는 자연스레 멀어지려 합니다.",
    tmi: "마상 입으면 말 줄어듦. 아무 말 안 하는 게 화났다는 신호임.",
  },
  B2: {
    title: "단절형 회피",
    description:
      "감정 소모를 꺼려하며, 갈등 상황에서 빠르게 관계를 끊거나 차단하는 성향을 보입니다.",
    tmi: "감정 소비는 낭비라고 생각함. 연락 안 받고 조용히 이별 중일 수도 있음.",
  },
  C1: {
    title: "논리형 무시",
    description:
      "감정보다 이성을 우선시하며, 감정 표현이나 공감을 다소 불필요하게 느끼기도 합니다. 상황을 객관적으로 분석하려는 성향입니다.",
    tmi: "감정 얘기 나올 땐 자동 로그아웃. 머릿속에선 이미 다음 일정 생각 중.",
  },
  C2: {
    title: "무관심형 무시",
    description:
      "감정에 큰 관심을 두지 않고, 상대방의 반응이나 감정을 신경 쓰지 않으려는 쿨한 태도를 보입니다.",
    tmi: "누가 뭐라 해도 '그럴 수도 있지'로 넘김. 근데 진짜 별생각 없긴 함.",
  },
  D1: {
    title: "순간 폭발형",
    description:
      "감정을 쌓아두지 않고 바로 표현하는 성향입니다. 감정에 솔직하지만 때로는 격해지기 쉽습니다.",
    tmi: "욱하면 말부터 튀어나옴. 싸우고 나서 ‘아 그때 왜 그랬지…’ 후폭풍 옴.",
  },
  D2: {
    title: "감정 축적형",
    description:
      "겉으로는 표현하지 않다가 참다 참다 폭발하는 성향입니다. 감정을 오래 쌓아두는 편입니다.",
    tmi: "참다 참다 뚜껑 열림. 그동안 감정 다 저장돼 있다가 폭발함.",
  },
};

export function calculateResult(answers: string[]): {
  type: string;
  title: string;
  description: string;
  tmi: string;
} {
  const countMap: Record<string, number> = {};

  for (const answer of answers) {
    countMap[answer] = (countMap[answer] || 0) + 1;
  }

  const finalType = Object.keys(countMap).reduce((a, b) =>
    countMap[a] > countMap[b] ? a : b
  );

  const { title, description, tmi } =
    typeDescriptions[finalType as keyof typeof typeDescriptions];

  return {
    type: finalType,
    title,
    description,
    tmi,
  };
}
