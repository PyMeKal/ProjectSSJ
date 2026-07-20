export function MetricToggle({ value, onChange }) {
  return (
    <div className="metric-toggle" role="group" aria-label="분석 단위">
      <button className={value === "count" ? "active" : ""} type="button" onClick={() => onChange("count")}>횟수</button>
      <button className={value === "percent" ? "active" : ""} type="button" onClick={() => onChange("percent")}>퍼센트</button>
    </div>
  );
}
