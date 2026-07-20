export function toParticipantRows(result) {
  return (result?.participants ?? []).map((participant) => ({
    name: participant.sender,
    count: participant.count,
    percent: participant.percent,
  }));
}

export function formatPeriod(period) {
  if (!period || period.label === "all") return "전체 기간";
  if (period.label === "day") return period.date;
  if (period.label === "month") return `${period.year}-${String(period.month).padStart(2, "0")}`;
  return String(period.year);
}

export function formatMetric(value, unit) {
  if (unit === "percent") return `${Number(value).toLocaleString()}%`;
  return `${Number(value).toLocaleString()}회`;
}
