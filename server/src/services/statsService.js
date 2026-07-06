const STOP_WORDS = new Set([
  "사진",
  "동영상",
  "이모티콘",
  "삭제된",
  "메시지입니다",
  "입니다",
  "그리고",
  "근데",
  "진짜",
  "그냥",
  "나는",
  "너는",
  "우리",
  "오늘",
  "내일",
  "어제",
]);

export function getSummary(db) {
  const row = db
    .prepare(
      `
        select
          count(*) as totalMessages,
          count(distinct sender) as participantCount,
          min(sent_date) as firstDate,
          max(sent_date) as lastDate
        from messages
      `,
    )
    .get();

  return {
    totalMessages: row.totalMessages ?? 0,
    participantCount: row.participantCount ?? 0,
    firstDate: row.firstDate,
    lastDate: row.lastDate,
  };
}

export function getUserRanking(db, limit = 20) {
  return db
    .prepare(
      `
        select sender, count(*) as count
        from messages
        group by sender
        order by count desc, sender asc
        limit ?
      `,
    )
    .all(limit);
}

export function getDailyStats(db) {
  return db
    .prepare(
      `
        select sent_date as date, count(*) as count
        from messages
        group by sent_date
        order by sent_date asc
      `,
    )
    .all();
}

export function getHourlyStats(db) {
  const rows = db
    .prepare(
      `
        select sent_hour as hour, count(*) as count
        from messages
        group by sent_hour
      `,
    )
    .all();

  const countByHour = new Map(rows.map((row) => [row.hour, row.count]));

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: countByHour.get(hour) ?? 0,
  }));
}

export function getTopWords(db, limit = 30) {
  const rows = db.prepare("select message from messages").all();
  const wordCounts = new Map();

  for (const row of rows) {
    for (const word of tokenize(row.message)) {
      wordCounts.set(word, (wordCounts.get(word) ?? 0) + 1);
    }
  }

  return [...wordCounts.entries()]
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count || a.word.localeCompare(b.word, "ko"))
    .slice(0, limit);
}

function tokenize(message) {
  return message
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/[^\p{L}\p{N}ㅋㅎㅠㅜ]+/gu, " ")
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 2)
    .filter((word) => !STOP_WORDS.has(word));
}
