import { CalendarDays, Search, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { MetricToggle } from "../components/MetricToggle.jsx";
import { PageIntro } from "../components/PageIntro.jsx";
import { ParticipantBars } from "../components/ParticipantBars.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { StatusMessage } from "../components/StatusMessage.jsx";
import { getTimeParticipation } from "../services/api.js";
import { formatPeriod, toParticipantRows } from "../utils/analysis.js";

const timeScopes = {
  all: { label: "전체 기간" },
  day: { label: "해당 날짜", inputLabel: "날짜", inputType: "date" },
  month: { label: "해당 월", inputLabel: "월", inputType: "month" },
  year: { label: "해당 년도", inputLabel: "년도", inputType: "number", placeholder: "예: 2026" },
};

export function TimeAnalysisPage({ routes, navigate }) {
  const [scope, setScope] = useState("all");
  const [filters, setFilters] = useState({ date: "", month: "", year: "" });
  const [metric, setMetric] = useState("count");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const rows = toParticipantRows(result);
  const top = rows[0];

  async function runAnalysis(nextScope = scope) {
    setStatus("loading");
    setErrorMessage("");
    try {
      setResult(await getTimeParticipation(buildTimeParams(nextScope, filters)));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  function changeScope(nextScope) {
    setScope(nextScope);
    setResult(null);
    setErrorMessage("");
    if (nextScope === "all") runAnalysis("all");
  }

  useEffect(() => { runAnalysis("all"); }, []);

  return (
    <section className="page-stack">
      <PageIntro eyebrow="TIME ANALYSIS" title="시간별 분석" description="기간별 사용자 참여 횟수와 비중을 확인하세요." onBack={() => navigate(routes.analysis)} />
      <div className="scope-tabs" role="tablist" aria-label="기간 단위">
        {Object.entries(timeScopes).map(([key, item]) => <button className={scope === key ? "active" : ""} type="button" key={key} onClick={() => changeScope(key)}>{item.label}</button>)}
      </div>
      <form className="filter-panel" onSubmit={(event) => { event.preventDefault(); runAnalysis(); }}>
        <label htmlFor="time-filter">{scope === "all" ? "분석 범위" : timeScopes[scope].inputLabel}</label>
        <div className="filter-row">
          {scope === "all" ? <p>모든 저장 메시지를 기준으로 분석합니다.</p> : <input id="time-filter" type={timeScopes[scope].inputType} min={scope === "year" ? "1900" : undefined} max={scope === "year" ? "2100" : undefined} value={filters[scope]} onChange={(event) => setFilters((current) => ({ ...current, [scope]: event.target.value }))} placeholder={timeScopes[scope].placeholder} required />}
          <button className="primary-button compact" type="submit" disabled={status === "loading"}><Search size={17} />{status === "loading" ? "분석 중" : "분석"}</button>
        </div>
      </form>
      <div className="stat-grid two-columns">
        <StatCard icon={CalendarDays} label="선택 기간" value={result ? formatPeriod(result.period) : "조회 전"} caption={`${(result?.totalMessages ?? 0).toLocaleString()}개 메시지`} />
        <StatCard icon={UsersRound} label="최다 발화" value={top?.name ?? "-"} caption={top ? `${top.count.toLocaleString()}회 · ${top.percent}%` : "아직 결과가 없습니다."} />
      </div>
      <section className="chart-panel">
        <div className="panel-heading"><div><h2>사용자별 활동</h2><p>{metric === "count" ? "메시지 발생 횟수" : "전체 메시지 대비 참여 비중"}</p></div><MetricToggle value={metric} onChange={setMetric} /></div>
        <ParticipantBars rows={rows} metric={metric} emptyMessage={status === "loading" ? "분석 데이터를 불러오는 중입니다." : "표시할 분석 결과가 없습니다."} />
      </section>
      <StatusMessage status={status} error={errorMessage} idle="분석할 기간을 선택해 주세요." loading="선택한 기간의 대화량을 계산하고 있습니다." empty="선택한 기간에 저장된 메시지가 없습니다." hasData={rows.length > 0} success={top ? `${top.name}님이 선택 기간 메시지의 ${top.percent}%를 보냈습니다.` : "분석이 완료되었습니다."} />
    </section>
  );
}

function buildTimeParams(scope, filters) {
  if (scope === "all") return { scope };
  return { scope, [scope]: filters[scope] };
}
