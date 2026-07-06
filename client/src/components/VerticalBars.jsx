export function VerticalBars({ items, labelKey, valueKey, suffix = "" }) {
  if (!items || items.length === 0) {
    return <p className="muted">아직 차트 데이터가 없습니다.</p>;
  }

  const maxValue = Math.max(...items.map((item) => item[valueKey]));

  return (
    <div className="bar-chart">
      {items.map((item) => {
        const value = item[valueKey];
        const height = maxValue > 0 ? `${Math.max((value / maxValue) * 100, 6)}%` : "6%";
        const label = `${item[labelKey]}${suffix}`;

        return (
          <div className="bar-item" key={label} title={`${label}: ${value.toLocaleString()}개`}>
            <div className="bar-value">{value.toLocaleString()}</div>
            <div className="bar-track">
              <div className="bar-fill" style={{ height }} />
            </div>
            <span>{label}</span>
          </div>
        );
      })}
    </div>
  );
}
