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
  return db.sequelize
    .query(
      `
        select
          count(*) as totalMessages,
          count(distinct sender) as participantCount,
          min(sent_date) as firstDate,
          max(sent_date) as lastDate
        from texts
      `,
      { type: db.Sequelize.QueryTypes.SELECT },
    )
    .then(([row]) => ({
      totalMessages: Number(row.totalMessages ?? 0),
      participantCount: Number(row.participantCount ?? 0),
      firstDate: row.firstDate,
      lastDate: row.lastDate,
    }));
}

export async function getUserRanking(db, limit = 20) {
  const rows = await db.Text.findAll({
    attributes: [
      "sender",
      [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "count"],
    ],
    group: ["sender"],
    order: [
      [db.Sequelize.literal("count"), "DESC"],
      ["sender", "ASC"],
    ],
    limit,
    raw: true,
  });

  return rows.map((row) => ({
    sender: row.sender,
    count: Number(row.count),
  }));
}

export async function getDailyStats(db) {
  const rows = await db.Text.findAll({
    attributes: [
      [db.Sequelize.col("sent_date"), "date"],
      [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "count"],
    ],
    group: [db.Sequelize.col("sent_date")],
    order: [[db.Sequelize.col("sent_date"), "ASC"]],
    raw: true,
  });

  return rows.map((row) => ({
    date: row.date,
    count: Number(row.count),
  }));
}

export async function getHourlyStats(db) {
  const rows = await db.Text.findAll({
    attributes: [
      [db.Sequelize.col("sent_hour"), "hour"],
      [db.Sequelize.fn("COUNT", db.Sequelize.col("id")), "count"],
    ],
    group: [db.Sequelize.col("sent_hour")],
    raw: true,
  });

  const countByHour = new Map(rows.map((row) => [row.hour, row.count]));

  return Array.from({ length: 24 }, (_, hour) => ({
    hour,
    count: Number(countByHour.get(hour) ?? 0),
  }));
}

export async function getTopWords(db, limit = 30) {
  const rows = await db.Text.findAll({
    attributes: ["message"],
    raw: true,
  });
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
