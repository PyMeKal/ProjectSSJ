export function ParticipantBars({ rows, valueLabel, suffix, emptyMessage = "표시할 결과가 없습니다." }) {
  if (rows.length === 0) {
    return (
      <section className="participant-bars empty-state" aria-label="참가자별 막대그래프">
        {emptyMessage}
      </section>
    );
  }

  const maxValue = Math.max(...rows.map((row) => row[valueLabel]), 1);

  return (
    <section className="participant-bars" aria-label="참가자별 막대그래프">
      {rows.map((row) => {
        const value = row[valueLabel];
        const width = `${Math.max((value / maxValue) * 100, value > 0 ? 8 : 0)}%`;

        return (
          <div className="participant-row" key={row.name}>
            <strong>{row.name}</strong>
            <div className="participant-track">
              <span className="participant-fill" style={{ width }} />
            </div>
            <span>{value.toLocaleString()}{suffix}</span>
          </div>
        );
      })}
    </section>
  );
}
