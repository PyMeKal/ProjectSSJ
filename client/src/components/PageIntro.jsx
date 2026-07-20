import { ChevronLeft } from "lucide-react";

export function PageIntro({ eyebrow, title, description, onBack, action }) {
  return (
    <div className="page-intro-row">
      <div className="page-intro">
        <div className="intro-kicker">
          {onBack ? (
            <button className="back-button" type="button" onClick={onBack} aria-label="이전 화면으로 돌아가기">
              <ChevronLeft size={17} />
            </button>
          ) : null}
          <span>{eyebrow}</span>
        </div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {action ? <div className="page-action">{action}</div> : null}
    </div>
  );
}
