import { ArrowRight, BarChart3, Clock3, Hash } from "lucide-react";
import { PageIntro } from "../components/PageIntro.jsx";
import { StatCard } from "../components/StatCard.jsx";

export function AnalysisHub({ routes, navigate }) {
  return (
    <section className="page-stack">
      <PageIntro
        eyebrow="Analysis Hub"
        title="어떤 기준으로 분석할까요?"
      />
      <div className="analysis-menu">
        <button className="analysis-card" type="button" onClick={() => navigate(routes.time)}>
          <span className="analysis-icon">
            <Clock3 size={26} />
          </span>
          <span>
            <strong>시간별 분석</strong>
            <small>해당 날짜, 월, 년도, 전체 기간 기준으로 누가 얼마나 말했는지 확인합니다.</small>
          </span>
          <ArrowRight size={20} />
        </button>
        <button className="analysis-card" type="button" onClick={() => navigate(routes.keyword)}>
          <span className="analysis-icon">
            <Hash size={26} />
          </span>
          <span>
            <strong>키워드별 분석</strong>
            <small>키워드를 입력해서 참가자별 언급 횟수를 비교합니다.</small>
          </span>
          <ArrowRight size={20} />
        </button>
      </div>
      <section className="insight-grid">
        <StatCard icon={BarChart3} label="최근 인기 키워드" value="여행, 맛집, 과제" />
        <StatCard icon={Clock3} label="가장 활발한 시간" value="23시" caption="밤 대화 비중 높음" />
      </section>
    </section>
  );
}
