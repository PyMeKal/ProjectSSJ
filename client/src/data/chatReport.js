export const chatRoom = {
  name: "우리들의 수다방",
  description:
    "친구들과 나눈 대화를 시간대와 키워드 기준으로 가볍게 살펴보는 채팅방 리포트입니다.",
  participants: ["A", "B", "C", "D"],
  totalMessages: 12480,
  period: "2025.07 - 2026.07",
};

export const timeFrames = {
  day: {
    label: "해당 날짜",
    range: "2026.07.02",
    total: 248,
    rows: [
      { name: "A", count: 96, percent: 39 },
      { name: "B", count: 67, percent: 27 },
      { name: "C", count: 52, percent: 21 },
      { name: "D", count: 33, percent: 13 },
    ],
  },
  month: {
    label: "해당 월",
    range: "2026.07",
    total: 1840,
    rows: [
      { name: "A", count: 640, percent: 35 },
      { name: "B", count: 515, percent: 28 },
      { name: "C", count: 405, percent: 22 },
      { name: "D", count: 280, percent: 15 },
    ],
  },
  year: {
    label: "해당 년도",
    range: "2026",
    total: 7680,
    rows: [
      { name: "A", count: 2688, percent: 35 },
      { name: "B", count: 2074, percent: 27 },
      { name: "C", count: 1766, percent: 23 },
      { name: "D", count: 1152, percent: 15 },
    ],
  },
  all: {
    label: "전체 기간",
    range: chatRoom.period,
    total: chatRoom.totalMessages,
    rows: [
      { name: "A", count: 4120, percent: 33 },
      { name: "B", count: 3494, percent: 28 },
      { name: "C", count: 2870, percent: 23 },
      { name: "D", count: 1996, percent: 16 },
    ],
  },
};

export const keywordExamples = {
  "사탕": [
    { name: "A", count: 4 },
    { name: "B", count: 2 },
    { name: "C", count: 0 },
    { name: "D", count: 0 },
  ],
  "여행": [
    { name: "A", count: 18 },
    { name: "B", count: 11 },
    { name: "C", count: 14 },
    { name: "D", count: 7 },
  ],
  "맛집": [
    { name: "A", count: 9 },
    { name: "B", count: 15 },
    { name: "C", count: 6 },
    { name: "D", count: 4 },
  ],
};
