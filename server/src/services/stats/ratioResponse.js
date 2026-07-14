export function buildRatioResponse({ type, scope, period, keyword, rows }) {
  const totalMessages = rows.reduce((sum, row) => sum + row.count, 0);

  return {
    type,
    scope,
    period,
    keyword,
    totalMessages,
    participants: rows.map((row) => {
      const ratio = totalMessages === 0 ? 0 : row.count / totalMessages;

      return {
        sender: row.sender,
        count: row.count,
        ratio,
        percent: Number((ratio * 100).toFixed(2)),
      };
    }),
  };
}
