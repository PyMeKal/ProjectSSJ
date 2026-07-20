import { formatMetric } from "../utils/analysis.js";

export function ParticipantBars({ rows, metric = "count", emptyMessage = "표시할 결과가 없습니다." }) {
  if (rows.length === 0) {
    return <div className="empty-state">{emptyMessage}</div>;
  }

  const maxValue = Math.max(...rows.map((row) => row[metric]), 1);

  return (
    <div className="participant-bars" aria-label={`참가자별 ${metric === "count" ? "횟수" : "퍼센트"} 막대그래프`}>
      {rows.map((row) => {
        const value = row[metric];
        const width = `${Math.max((value / maxValue) * 100, value > 0 ? 4 : 0)}%`;
        return (
          <div className="participant-row" key={row.name}>
            <strong>{row.name}</strong>
            <div className="participant-track"><span style={{ width }} /></div>
            <b>{formatMetric(value, metric)}</b>
          </div>
        );
      })}
    </div>
  );
}
