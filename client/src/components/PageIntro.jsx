import { ChevronLeft } from "lucide-react";

export function PageIntro({ eyebrow, title, description, onBack }) {
  return (
    <div className="page-intro">
      <div className="intro-kicker">
        {onBack ? (
          <button className="title-back-button" type="button" onClick={onBack} aria-label="분석 메뉴로 돌아가기">
            <ChevronLeft size={18} />
          </button>
        ) : null}
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </div>
  );
}
