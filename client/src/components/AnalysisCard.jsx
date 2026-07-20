import { ArrowRight } from "lucide-react";

export function AnalysisCard({ icon: Icon, title, description, tone, onClick }) {
  return (
    <button className={`analysis-card ${tone}`} type="button" onClick={onClick}>
      <span className="analysis-card-icon"><Icon size={23} /></span>
      <strong>{title}</strong>
      <small>{description}</small>
      <span className="analysis-link">분석 보기 <ArrowRight size={15} /></span>
    </button>
  );
}
