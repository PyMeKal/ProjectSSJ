import { CalendarDays, Users } from "lucide-react";
import { useState } from "react";
import { PageIntro } from "../components/PageIntro.jsx";
import { ParticipantBars } from "../components/ParticipantBars.jsx";
import { StatCard } from "../components/StatCard.jsx";
import { timeFrames } from "../data/chatReport.js";
import { routes } from "../routes.js";

export function TimeAnalysisPage({ navigate }) {
  const [frameKey, setFrameKey] = useState("day");
  const frame = timeFrames[frameKey];
  const topSpeaker = frame.rows[0];

  return (
    <section className="page-stack">
      <PageIntro
        eyebrow="Time Analysis"
        title="시간별 분석"
        onBack={() => navigate(routes.analysis)}
      />
      <div className="segment-control" role="tablist" aria-label="기간 단위">
        {Object.entries(timeFrames).map(([key, item]) => (
          <button
            className={frameKey === key ? "active" : ""}
            type="button"
            key={key}
            onClick={() => setFrameKey(key)}
          >
            {item.label}
          </button>
        ))}
      </div>
      <section className="insight-grid">
        <StatCard icon={CalendarDays} label="선택 기간" value={frame.range} caption={`${frame.total.toLocaleString()}개 메시지`} />
        <StatCard icon={Users} label="최다 발화" value={topSpeaker.name} caption={`${topSpeaker.count.toLocaleString()}회, ${topSpeaker.percent}%`} />
      </section>
      <ParticipantBars rows={frame.rows} valueLabel="percent" suffix="%" />
    </section>
  );
}
