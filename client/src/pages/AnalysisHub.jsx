import { Activity, Clock3, Hash, MessageSquareText, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { AnalysisCard } from "../components/AnalysisCard.jsx";
import { PageIntro } from "../components/PageIntro.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { getTimeParticipation } from "../services/api.js";

export function AnalysisHub({ routes, navigate, user }) {
  const [result, setResult] = useState(null);

  useEffect(() => {
    let ignore = false;
    getTimeParticipation({ scope: "all" }).then((data) => { if (!ignore) setResult(data); }).catch(() => {});
    return () => { ignore = true; };
  }, []);

  const participants = result?.participants ?? [];
  const top = participants[0];

  return (
    <section className="page-stack">
      <PageIntro eyebrow="ANALYSIS HUB" title={user ? `안녕하세요, ${user.name}님` : "어떤 기준으로 분석할까요?"} description="데이터 흐름을 살펴보고 필요한 분석을 시작하세요." />
      <div className="stat-grid">
        <StatCard icon={MessageSquareText} label="전체 메시지" value={(result?.totalMessages ?? 0).toLocaleString()} caption="서버 분석 데이터" />
        <StatCard icon={UsersRound} label="참여 사용자" value={`${participants.length}명`} caption="전체 기간 기준" />
        <StatCard icon={Activity} label="최다 참여자" value={top?.sender ?? "-"} caption={top ? `${top.percent}% 참여` : "데이터 조회 중"} />
      </div>
      <div className="analysis-card-grid">
        <AnalysisCard icon={Clock3} title="시간별 분석" description="날짜, 월, 연도 또는 전체 기간의 참여 흐름을 확인하세요." tone="blue" onClick={() => navigate(routes.time)} />
        <AnalysisCard icon={Hash} title="키워드별 분석" description="검색 키워드가 포함된 메시지와 참여 비중을 비교하세요." tone="violet" onClick={() => navigate(routes.keyword)} />
        <AnalysisCard icon={UsersRound} title="유저별 분석" description="사용자별 활동량과 전체 대화 참여 비중을 비교하세요." tone="green" onClick={() => navigate(routes.users)} />
      </div>
    </section>
  );
}
