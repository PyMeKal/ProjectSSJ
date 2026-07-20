export function StatusMessage({ status, error, idle, loading, empty, success, hasData }) {
  if (error) return <p className="status-message error">{error}</p>;
  if (status === "loading") return <p className="status-message">{loading}</p>;
  if (status === "idle") return <p className="status-message">{idle}</p>;
  return <p className="status-message">{hasData ? success : empty}</p>;
}
