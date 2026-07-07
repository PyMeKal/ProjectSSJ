import { Hash, MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "../components/PageIntro.jsx";
import { ParticipantBars } from "../components/ParticipantBars.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { chatRoom, keywordExamples } from "../data/chatReport.js";
import { routes } from "../routes.js";

export function KeywordAnalysisPage({ navigate }) {
  const [keyword, setKeyword] = useState("사탕");
  const rows = keywordExamples[keyword] ?? chatRoom.participants.map((name) => ({ name, count: 0 }));
  const total = rows.reduce((sum, row) => sum + row.count, 0);
  const top = rows.reduce((winner, row) => (row.count > winner.count ? row : winner), rows[0]);

  const summary =
    total === 0
      ? `"${keyword}" 키워드 언급이 아직 없습니다.`
      : `${top.name}는 "${keyword}"을(를) ${top.count}번 말했고, 전체 언급은 ${total}번입니다.`;

  return (
    <section className="page-stack">
      <PageIntro
        eyebrow="Keyword Analysis"
        title="키워드별 분석"
        onBack={() => navigate(routes.analysis)}
      />
      <form className="keyword-form" onSubmit={(event) => event.preventDefault()}>
        <label htmlFor="keyword">검색 키워드</label>
        <div>
          <input id="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value.trim())} placeholder="예: 사탕" />
          <button className="primary-button" type="submit">
            <Search size={18} />
            분석
          </button>
        </div>
      </form>
      <section className="insight-grid">
        <StatCard icon={Hash} label="검색 키워드" value={keyword || "-"} />
        <StatCard icon={MessageCircle} label="총 언급" value={`${total.toLocaleString()}회`} caption={top ? `최다 언급: ${top.name}` : undefined} />
      </section>
      <ParticipantBars rows={rows} valueLabel="count" suffix="회" />
      <p className="result-note">{summary}</p>
    </section>
  );
}
