export function StatCard({ icon: Icon, label, value, caption }) {
  return (
    <article className="stat-card">
      <div className="stat-icon">
        <Icon size={20} />
      </div>
      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        {caption ? <span>{caption}</span> : null}
      </div>
    </article>
  );
}
