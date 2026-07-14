import { CalendarDays, Search, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { PageIntro } from "../components/PageIntro.jsx";
import { ParticipantBars } from "../components/ParticipantBars.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { getTimeParticipation } from "../services/api.js";

const timeScopes = {
  all: { label: "전체 기간" },
  day: { label: "해당 날짜", inputLabel: "날짜", inputType: "date" },
  month: { label: "해당 월", inputLabel: "월", inputType: "month" },
  year: { label: "해당 년도", inputLabel: "년도", inputType: "number", placeholder: "예: 2026" },
};

export function TimeAnalysisPage({ routes, navigate }) {
  const [scope, setScope] = useState("all");
  const [filters, setFilters] = useState({ date: "", month: "", year: "" });
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const rows = toBarRows(result);
  const topSpeaker = rows[0];
  const totalMessages = result?.totalMessages ?? 0;
  const selectedScope = timeScopes[scope];
  const periodLabel = result ? formatPeriod(result.period) : "조회 전";

  async function runAnalysis(nextScope = scope) {
    const params = buildTimeParams(nextScope, filters);
    if (!params) return;

    setStatus("loading");
    setErrorMessage("");

    try {
      setResult(await getTimeParticipation(params));
      setStatus("success");
    } catch (error) {
      setStatus("error");
      setErrorMessage(error.message);
    }
  }

  function handleScopeChange(nextScope) {
    setScope(nextScope);
    setErrorMessage("");
    setResult(null);
    setStatus("idle");

    if (nextScope === "all") {
      runAnalysis(nextScope);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    runAnalysis();
  }

  function updateFilter(key, value) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  useEffect(() => {
    runAnalysis("all");
  }, []);

  return (
    <section className="page-stack">
      <PageIntro
        eyebrow="Time Analysis"
        title="시간별 분석"
        onBack={() => navigate(routes.analysis)}
      />
      <div className="segment-control" role="tablist" aria-label="기간 단위">
        {Object.entries(timeScopes).map(([key, item]) => (
          <button
            className={scope === key ? "active" : ""}
            type="button"
            key={key}
            onClick={() => handleScopeChange(key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <form className="analysis-form" onSubmit={handleSubmit}>
        <label htmlFor="time-filter">{scope === "all" ? "분석 범위" : selectedScope.inputLabel}</label>
        <div className="analysis-form-row">
          {scope === "all" ? (
            <p className="form-static-text">모든 카카오톡 메시지를 기준으로 참여 비율을 계산합니다.</p>
          ) : (
            <input
              id="time-filter"
              type={selectedScope.inputType}
              min={scope === "year" ? "1900" : undefined}
              max={scope === "year" ? "2100" : undefined}
              value={filters[scope]}
              onChange={(event) => updateFilter(scope, event.target.value)}
              placeholder={selectedScope.placeholder}
              required
            />
          )}
          <button className="primary-button" type="submit" disabled={status === "loading"}>
            <Search size={18} />
            {status === "loading" ? "분석 중" : "분석"}
          </button>
        </div>
      </form>
      <section className="insight-grid">
        <StatCard icon={CalendarDays} label="선택 기간" value={periodLabel} caption={`${totalMessages.toLocaleString()}개 메시지`} />
        <StatCard
          icon={Users}
          label="최다 발화"
          value={topSpeaker?.name ?? "-"}
          caption={topSpeaker ? `${topSpeaker.count.toLocaleString()}회, ${topSpeaker.percent}%` : "아직 결과가 없습니다."}
        />
      </section>
      <ParticipantBars rows={rows} valueLabel="percent" suffix="%" />
      <p className="result-note">
        {errorMessage || buildTimeSummary(status, totalMessages, topSpeaker)}
      </p>
    </section>
  );
}

function buildTimeParams(scope, filters) {
  if (scope === "all") return { scope };
  if (scope === "day") return { scope, date: filters.date };
  if (scope === "month") return { scope, month: filters.month };
  return { scope, year: filters.year };
}

function toBarRows(result) {
  return (result?.participants ?? []).map((participant) => ({
    name: participant.sender,
    count: participant.count,
    percent: participant.percent,
  }));
}

function formatPeriod(period) {
  if (!period || period.label === "all") return "전체 기간";
  if (period.label === "day") return period.date;
  if (period.label === "month") return `${period.year}-${String(period.month).padStart(2, "0")}`;
  return String(period.year);
}

function buildTimeSummary(status, totalMessages, topSpeaker) {
  if (status === "idle") return "분석할 기간을 선택한 뒤 분석 버튼을 눌러 주세요.";
  if (status === "loading") return "선택한 기간의 대화량을 계산하고 있습니다.";
  if (totalMessages === 0) return "선택한 기간에 저장된 메시지가 없습니다.";
  return `${topSpeaker.name}님이 선택한 기간 메시지의 ${topSpeaker.percent}%를 보냈습니다.`;
}
