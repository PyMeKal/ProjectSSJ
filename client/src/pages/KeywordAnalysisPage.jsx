import { Hash, MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "../components/PageIntro.jsx";
import { ParticipantBars } from "../components/ParticipantBars.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { getKeywordParticipation } from "../services/api.js";

export function KeywordAnalysisPage({ routes, navigate }) {
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const rows = toBarRows(result);
  const total = result?.totalMessages ?? 0;
  const top = rows[0];

  async function handleSubmit(event) {
    event.preventDefault();

    const nextKeyword = keyword.trim();
    if (!nextKeyword) {
      setErrorMessage("검색할 키워드를 입력해 주세요.");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      setResult(await getKeywordParticipation(nextKeyword));
      setSearchedKeyword(nextKeyword);
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  return (
    <section className="page-stack">
      <PageIntro
        eyebrow="Keyword Analysis"
        title="키워드별 분석"
        onBack={() => navigate(routes.analysis)}
      />
      <form className="analysis-form" onSubmit={handleSubmit}>
        <label htmlFor="keyword">검색 키워드</label>
        <div className="analysis-form-row">
          <input id="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="예: 사탕" />
          <button className="primary-button" type="submit" disabled={status === "loading"}>
            <Search size={18} />
            {status === "loading" ? "분석 중" : "분석"}
          </button>
        </div>
      </form>
      <section className="insight-grid">
        <StatCard icon={Hash} label="검색 키워드" value={searchedKeyword || "-"} />
        <StatCard icon={MessageCircle} label="총 언급" value={`${total.toLocaleString()}회`} caption={top ? `최다 언급: ${top.name}` : "아직 결과가 없습니다."} />
      </section>
      <ParticipantBars rows={rows} valueLabel="percent" suffix="%" />
      <p className="result-note">
        {errorMessage || buildKeywordSummary(status, searchedKeyword, total, top)}
      </p>
    </section>
  );
}

function toBarRows(result) {
  return (result?.participants ?? []).map((participant) => ({
    name: participant.sender,
    count: participant.count,
    percent: participant.percent,
  }));
}

function buildKeywordSummary(status, keyword, total, top) {
  if (status === "idle") return "키워드를 입력한 뒤 분석 버튼을 눌러 주세요.";
  if (status === "loading") return "키워드가 포함된 메시지를 찾고 있습니다.";
  if (total === 0) return `"${keyword}" 키워드가 포함된 메시지가 없습니다.`;
  return `${top.name}님이 "${keyword}" 키워드 포함 메시지의 ${top.percent}%를 보냈습니다.`;
}
