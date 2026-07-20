export function StatCard({ icon: Icon, label, value, caption, positive }) {
  return (
    <article className="stat-card">
      <div className="stat-heading">
        <span>{label}</span>
        <span className="stat-icon"><Icon size={18} /></span>
      </div>
      <strong>{value}</strong>
      {caption ? <p><b className={positive ? "positive" : ""}>{positive}</b>{positive ? " " : ""}{caption}</p> : null}
    </article>
  );
}
