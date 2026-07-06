import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  ChevronLeft,
  Clock3,
  Hash,
  LogIn,
  MessageCircle,
  Search,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { StatCard } from "./components/StatCard.jsx";
import "./styles.css";

const routes = {
  main: "/",
  analysis: "/analysis",
  time: "/analysis/time",
  keyword: "/analysis/keyword",
};

const chatRoom = {
  name: "우리들의 수다방",
  description:
    "친구들과 나눈 대화를 시간대와 키워드 기준으로 가볍게 살펴보는 채팅방 리포트입니다.",
  participants: ["A", "B", "C", "D"],
  totalMessages: 12480,
  period: "2025.07 - 2026.07",
};

const timeFrames = {
  day: {
    label: "해당 날짜",
    range: "2026.07.02",
    total: 248,
    rows: [
      { name: "A", count: 96, percent: 39 },
      { name: "B", count: 67, percent: 27 },
      { name: "C", count: 52, percent: 21 },
      { name: "D", count: 33, percent: 13 },
    ],
  },
  month: {
    label: "해당 월",
    range: "2026.07",
    total: 1840,
    rows: [
      { name: "A", count: 640, percent: 35 },
      { name: "B", count: 515, percent: 28 },
      { name: "C", count: 405, percent: 22 },
      { name: "D", count: 280, percent: 15 },
    ],
  },
  year: {
    label: "해당 년도",
    range: "2026",
    total: 7680,
    rows: [
      { name: "A", count: 2688, percent: 35 },
      { name: "B", count: 2074, percent: 27 },
      { name: "C", count: 1766, percent: 23 },
      { name: "D", count: 1152, percent: 15 },
    ],
  },
  all: {
    label: "전체 기간",
    range: chatRoom.period,
    total: chatRoom.totalMessages,
    rows: [
      { name: "A", count: 4120, percent: 33 },
      { name: "B", count: 3494, percent: 28 },
      { name: "C", count: 2870, percent: 23 },
      { name: "D", count: 1996, percent: 16 },
    ],
  },
};

const keywordExamples = {
  "사탕": [
    { name: "A", count: 4 },
    { name: "B", count: 2 },
    { name: "C", count: 0 },
    { name: "D", count: 0 },
  ],
  "여행": [
    { name: "A", count: 18 },
    { name: "B", count: 11 },
    { name: "C", count: 14 },
    { name: "D", count: 7 },
  ],
  "맛집": [
    { name: "A", count: 9 },
    { name: "B", count: 15 },
    { name: "C", count: 6 },
    { name: "D", count: 4 },
  ],
};

function getCurrentRoute() {
  const path = window.location.pathname;
  if (Object.values(routes).includes(path)) return path;
  return routes.main;
}

function useRoute() {
  const [route, setRoute] = useState(getCurrentRoute);

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  const navigate = (nextRoute) => {
    window.history.pushState({}, "", nextRoute);
    setRoute(nextRoute);
  };

  return [route, navigate];
}

function Shell({ route, navigate, children }) {
  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="header-left">
          <button className="brand-button" type="button" onClick={() => navigate(routes.main)}>
            <span className="brand-mark" aria-hidden="true" />
            <span>Project SSJ</span>
          </button>
          <nav className="top-nav" aria-label="주요 화면">
            <button className={route === routes.main ? "active" : ""} type="button" onClick={() => navigate(routes.main)}>
              홈
            </button>
            <button className={route !== routes.main ? "active" : ""} type="button" onClick={() => navigate(routes.analysis)}>
              분석
            </button>
          </nav>
        </div>
        <button className="login-button" type="button">
          <LogIn size={17} />
          로그인
        </button>
      </header>
      {children}
    </main>
  );
}

function MainPage({ navigate }) {
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

function AnalysisHub({ navigate }) {
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

function TimeAnalysisPage({ navigate }) {
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

function KeywordAnalysisPage({ navigate }) {
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

function ParticipantBars({ rows, valueLabel, suffix }) {
  const maxValue = Math.max(...rows.map((row) => row[valueLabel]), 1);

  return (
    <section className="participant-bars" aria-label="참가자별 막대그래프">
      {rows.map((row) => {
        const value = row[valueLabel];
        const width = `${Math.max((value / maxValue) * 100, value > 0 ? 8 : 0)}%`;

        return (
          <div className="participant-row" key={row.name}>
            <strong>{row.name}</strong>
            <div className="participant-track">
              <span className="participant-fill" style={{ width }} />
            </div>
            <span>{value.toLocaleString()}{suffix}</span>
          </div>
        );
      })}
    </section>
  );
}

function PageIntro({ eyebrow, title, description, onBack }) {
  return (
    <div className="page-intro">
      <div className="intro-kicker">
        {onBack ? (
          <button className="title-back-button" type="button" onClick={onBack} aria-label="분석 메뉴로 돌아가기">
            <ChevronLeft size={18} />
          </button>
        ) : null}
        <p className="eyebrow">{eyebrow}</p>
      </div>
      <h1>{title}</h1>
      {description ? <p>{description}</p> : null}
    </div>
  );
}

export default function App() {
  const [route, navigate] = useRoute();

  const page = useMemo(() => {
    if (route === routes.analysis) return <AnalysisHub navigate={navigate} />;
    if (route === routes.time) return <TimeAnalysisPage navigate={navigate} />;
    if (route === routes.keyword) return <KeywordAnalysisPage navigate={navigate} />;
    return <MainPage navigate={navigate} />;
  }, [route, navigate]);

  return (
    <Shell route={route} navigate={navigate}>
      {page}
    </Shell>
  );
}
