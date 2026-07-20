const colors = ["#316bff", "#7a5af8", "#22a06b", "#f79009"];

function buildGradient(rows) {
  let cursor = 0;
  const stops = rows.slice(0, 4).map((row, index) => {
    const start = cursor;
    cursor += row.percent;
    return `${colors[index]} ${start}% ${Math.min(cursor, 100)}%`;
  });
  if (cursor < 100) stops.push(`#e9edf4 ${cursor}% 100%`);
  return `conic-gradient(${stops.join(", ")})`;
}

export function ContributionDonut({ rows, total }) {
  const visibleRows = rows.slice(0, 4);

  return (
    <div className="donut-layout">
      <div className="donut" style={{ background: buildGradient(visibleRows) }}>
        <span><strong>{total.toLocaleString()}</strong><small>전체 활동</small></span>
      </div>
      <div className="donut-legend">
        {visibleRows.map((row, index) => (
          <div key={row.name}>
            <span><i style={{ background: colors[index] }} />{row.name}</span>
            <strong>{row.percent}%</strong>
          </div>
        ))}
      </div>
    </div>
  );
}
