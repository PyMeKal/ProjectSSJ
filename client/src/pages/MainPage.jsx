import { ArrowRight, BarChart3, Hash, UsersRound } from "lucide-react";

export function MainPage({ routes, navigate, user }) {
  return (
    <section className="home-grid">
      <article className="home-hero">
        <p className="eyebrow">SMART SOCIAL JOURNEY</p>
        <h1>{user ? `${user.name}님,` : "대화 데이터에서"}<br />의미 있는 흐름을 발견하세요.</h1>
        <p>Project SSJ는 카카오톡 대화를 시간, 키워드, 사용자 기준으로 정리해 보여줍니다.</p>
        <button className="primary-button" type="button" onClick={() => navigate(routes.analysis)}>분석 시작하기 <ArrowRight size={18} /></button>
      </article>
      <aside className="home-feature-list">
        <div><BarChart3 /><span><strong>시간별 분석</strong><small>기간별 참여 흐름</small></span></div>
        <div><Hash /><span><strong>키워드별 분석</strong><small>관심 주제와 언급량</small></span></div>
        <div><UsersRound /><span><strong>유저별 분석</strong><small>참여자별 활동 비중</small></span></div>
      </aside>
    </section>
  );
}
