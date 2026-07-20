import { Check, LockKeyhole, ShieldCheck, UserRound } from "lucide-react";
import { PageIntro } from "../components/PageIntro.jsx";

export function UserPage({ routes, navigate, user }) {
  return (
    <section className="page-stack">
      <PageIntro eyebrow="USER SETTINGS" title="내 정보" description="프로필과 보안 설정을 관리하세요." onBack={() => navigate(routes.main)} />
      <div className="settings-grid">
        <aside className="profile-panel">
          <span className="settings-avatar"><UserRound size={30} /></span>
          <div><small>현재 사용자</small><strong>{user?.name ?? "SSJ 사용자"}</strong><p>{user?.email ?? "로그인이 필요합니다."}</p></div>
        </aside>
        <form className="settings-panel" onSubmit={(event) => event.preventDefault()}>
          <div className="panel-heading"><span className="stat-icon"><ShieldCheck size={19} /></span><div><h2>비밀번호 변경</h2><p>현재 비밀번호 확인 후 새 비밀번호로 변경합니다.</p></div></div>
          <label htmlFor="current-password">현재 비밀번호</label><div className="field-control"><LockKeyhole size={17} /><input id="current-password" type="password" /></div>
          <label htmlFor="new-password">새 비밀번호</label><div className="field-control"><LockKeyhole size={17} /><input id="new-password" type="password" /></div>
          <button className="primary-button compact" type="submit"><Check size={17} />변경 저장</button>
        </form>
      </div>
    </section>
  );
}
