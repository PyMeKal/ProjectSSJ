import { Hash, MessageCircle, Search } from "lucide-react";
import { useState } from "react";
import { MetricToggle } from "../components/MetricToggle.jsx";
import { PageIntro } from "../components/PageIntro.jsx";
import { ParticipantBars } from "../components/ParticipantBars.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { getKeywordParticipation } from "../services/api.js";
import { toParticipantRows } from "../utils/analysis.js";

export function KeywordAnalysisPage({ routes, navigate }) {
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [metric, setMetric] = useState("count");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const rows = toParticipantRows(result);
  const top = rows[0];

  async function handleSubmit(event) {
    event.preventDefault();
    const nextKeyword = keyword.trim();
    if (!nextKeyword) return setErrorMessage("검색할 키워드를 입력해 주세요.");
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
      <PageIntro eyebrow="KEYWORD ANALYSIS" title="키워드별 분석" description="키워드별 언급 횟수와 사용자 참여 비중을 확인하세요." onBack={() => navigate(routes.analysis)} />
      <form className="filter-panel" onSubmit={handleSubmit}>
        <label htmlFor="keyword">검색 키워드</label>
        <div className="filter-row"><input id="keyword" value={keyword} onChange={(event) => setKeyword(event.target.value)} placeholder="예: 여행, 맛집, 과제" /><button className="primary-button compact" type="submit" disabled={status === "loading"}><Search size={17} />{status === "loading" ? "분석 중" : "분석"}</button></div>
      </form>
      <div className="stat-grid two-columns">
        <StatCard icon={Hash} label="검색 키워드" value={searchedKeyword || "-"} caption="현재 분석 기준" />
        <StatCard icon={MessageCircle} label="총 언급" value={`${(result?.totalMessages ?? 0).toLocaleString()}회`} caption={top ? `최다 언급 · ${top.name}` : "아직 결과가 없습니다."} />
      </div>
      <section className="chart-panel">
        <div className="panel-heading"><div><h2>사용자별 키워드 활동</h2><p>{metric === "count" ? "키워드 포함 메시지 횟수" : "전체 키워드 메시지 대비 비중"}</p></div><MetricToggle value={metric} onChange={setMetric} /></div>
        <ParticipantBars rows={rows} metric={metric} />
      </section>
      <StatusMessage status={status} error={errorMessage} idle="키워드를 입력한 뒤 분석 버튼을 눌러 주세요." loading="키워드가 포함된 메시지를 찾고 있습니다." empty={`“${searchedKeyword}” 키워드가 포함된 메시지가 없습니다.`} hasData={rows.length > 0} success={top ? `${top.name}님이 “${searchedKeyword}” 포함 메시지의 ${top.percent}%를 보냈습니다.` : "분석이 완료되었습니다."} />
    </section>
  );
}
