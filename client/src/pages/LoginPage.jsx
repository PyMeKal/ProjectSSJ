import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useState } from "react";

export function LoginPage({ routes, navigate, onLogin }) {
  const [name, setName] = useState("윤서준");
  const [email, setEmail] = useState("ssj@example.com");

  function handleSubmit(event) {
    event.preventDefault();
    onLogin({ name: name.trim(), email: email.trim() });
    navigate(routes.analysis);
  }

  return (
    <main className="login-page">
      <section className="login-visual">
        <div className="login-brand"><span>SSJ</span><strong>Project SSJ</strong></div>
        <div className="login-copy">
          <p>SMART SOCIAL JOURNEY</p>
          <h1>데이터 속에서<br />더 나은 답을 찾다.</h1>
          <span>시간, 키워드, 사용자 데이터를 한눈에 분석하고 인사이트를 발견하세요.</span>
        </div>
        <small>© 2026 Project SSJ. All rights reserved.</small>
      </section>
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>다시 만나 반가워요</h2>
          <p>분석 대시보드를 계속 이용하려면 로그인하세요.</p>
          <label htmlFor="login-name">이름</label>
          <div className="field-control"><UserRound size={18} /><input id="login-name" value={name} onChange={(event) => setName(event.target.value)} required /></div>
          <label htmlFor="login-email">아이디 또는 이메일</label>
          <div className="field-control"><UserRound size={18} /><input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></div>
          <label htmlFor="login-password">비밀번호</label>
          <div className="field-control"><LockKeyhole size={18} /><input id="login-password" type="password" defaultValue="projectssj" required /></div>
          <button className="primary-button" type="submit">로그인 <ArrowRight size={18} /></button>
          <button className="text-button" type="button" onClick={() => navigate(routes.main)}>로그인 없이 둘러보기</button>
        </form>
      </section>
    </main>
  );
}
