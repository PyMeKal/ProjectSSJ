import { Activity, Search, TrendingUp, UsersRound } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { ContributionDonut } from "../components/ContributionDonut.jsx";
import { PageIntro } from "../components/PageIntro.jsx";
import { ParticipantBars } from "../components/ParticipantBars.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { getTimeParticipation } from "../services/api.js";
import { toParticipantRows } from "../utils/analysis.js";

export function UserAnalysisPage({ routes, navigate }) {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const rows = useMemo(() => toParticipantRows(result), [result]);
  const filteredRows = rows.filter((row) => row.name.toLowerCase().includes(query.trim().toLowerCase()));

  useEffect(() => {
    let ignore = false;
    getTimeParticipation({ scope: "all" })
      .then((data) => { if (!ignore) { setResult(data); setStatus("success"); } })
      .catch((error) => { if (!ignore) { setErrorMessage(error.message); setStatus("error"); } });
    return () => { ignore = true; };
  }, []);

  const average = rows.length ? result.totalMessages / rows.length : 0;
  const top = rows[0];
  const searchBox = <label className="search-box"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="사용자 검색" /></label>;

  return (
    <section className="page-stack">
      <PageIntro eyebrow="USER ANALYSIS" title="유저별 분석" description="사용자별 활동량과 전체 대화 참여 비중을 비교하세요." onBack={() => navigate(routes.analysis)} action={searchBox} />
      <div className="stat-grid">
        <StatCard icon={Activity} label="총 사용자 활동" value={(result?.totalMessages ?? 0).toLocaleString()} caption="전체 기간 메시지" />
        <StatCard icon={UsersRound} label="활성 사용자" value={`${rows.length}명`} caption="메시지 발화 사용자" />
        <StatCard icon={TrendingUp} label="평균 활동" value={`${Math.round(average).toLocaleString()}회`} caption={top ? `최다 참여 · ${top.name}` : "데이터 조회 중"} />
      </div>
      {errorMessage ? <p className="status-message error">{errorMessage}</p> : null}
      <div className="user-analysis-grid">
        <section className="chart-panel">
          <div className="panel-heading"><div><h2>사용자별 활동량</h2><p>전체 기간의 메시지 발생 횟수</p></div><span className="unit-badge">단위 · 회</span></div>
          <ParticipantBars rows={filteredRows} metric="count" emptyMessage={status === "loading" ? "사용자 분석 데이터를 불러오는 중입니다." : "일치하는 사용자가 없습니다."} />
        </section>
        <section className="chart-panel">
          <div className="panel-heading"><div><h2>참여 비중</h2><p>상위 사용자 기준</p></div></div>
          <ContributionDonut rows={rows} total={result?.totalMessages ?? 0} />
        </section>
      </div>
      <section className="table-panel">
        <div className="panel-heading"><div><h2>사용자 상세</h2><p>활동량 기준으로 정렬된 사용자 목록입니다.</p></div></div>
        <div className="table-scroll"><table><thead><tr><th>사용자</th><th>활동 수</th><th>참여 비중</th><th>순위</th><th>상태</th></tr></thead><tbody>{filteredRows.map((row, index) => <tr key={row.name}><td><span className="table-user"><i>{[...row.name].slice(0, 2).join("")}</i><strong>{row.name}</strong></span></td><td>{row.count.toLocaleString()}회</td><td>{row.percent}%</td><td>#{rows.findIndex((item) => item.name === row.name) + 1}</td><td><span className="active-status">활성</span></td></tr>)}</tbody></table></div>
      </section>
    </section>
  );
}
