import { ArrowRight } from "lucide-react";
import { chatRoom } from "../data/chatReport.js";

export function MainPage({ routes, navigate }) {
  return (
    <section className="hero-section">
      <div className="hero-copy">
        <p className="eyebrow">Chat Room Report</p>
        <h1>{chatRoom.name}</h1>
        <p>{chatRoom.description}</p>
        <div className="hero-actions">
          <button className="primary-button" type="button" onClick={() => navigate(routes.analysis)}>
            분석 보러가기
            <ArrowRight size={18} />
          </button>
          <button className="secondary-button" type="button">
            공유 링크 복사
          </button>
        </div>
      </div>
      <aside className="hero-summary-list" aria-label="채팅방 요약">
        <dl>
          <div>
            <dt>참여자</dt>
            <dd>{chatRoom.participants.length}명</dd>
          </div>
          <div>
            <dt>총 메시지</dt>
            <dd>{chatRoom.totalMessages.toLocaleString()}</dd>
          </div>
          <div>
            <dt>분석 기간</dt>
            <dd>{chatRoom.period}</dd>
          </div>
        </dl>
      </aside>
    </section>
  );
}
