export function RankingList({ items }) {
  if (!items || items.length === 0) {
    return <p className="muted">아직 순위 데이터가 없습니다.</p>;
  }

  const maxCount = Math.max(...items.map((item) => item.count));

  return (
    <ol className="ranking-list">
      {items.map((item, index) => {
        const width = maxCount > 0 ? `${Math.max((item.count / maxCount) * 100, 8)}%` : "8%";

        return (
          <li className="ranking-row" key={item.sender}>
            <div className="rank-meta">
              <span className="rank-number">{index + 1}</span>
              <strong>{item.sender}</strong>
              <span>{item.count.toLocaleString()}개</span>
            </div>
            <div className="rank-track" aria-hidden="true">
              <div className="rank-fill" style={{ width }} />
            </div>
          </li>
        );
      })}
    </ol>
  );
}
