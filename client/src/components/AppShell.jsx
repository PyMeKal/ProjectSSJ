import { BarChart3, Bell, Clock3, Hash, Home, LayoutGrid, UsersRound } from "lucide-react";
import { ProfileMenu } from "./ProfileMenu.jsx";

export function AppShell({ route, routes, navigate, user, onLogout, children }) {
  const navItems = [
    { route: routes.main, label: "홈", icon: Home },
    { route: routes.analysis, label: "AnalysisHub", icon: LayoutGrid },
    { route: routes.time, label: "시간별 분석", icon: Clock3 },
    { route: routes.keyword, label: "키워드별 분석", icon: Hash },
    { route: routes.users, label: "유저별 분석", icon: UsersRound },
  ];
  const pageTitle = navItems.find((item) => item.route === route)?.label ?? (route === routes.user ? "내 정보" : "Project SSJ");

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand-button" type="button" onClick={() => navigate(routes.main)}>
          <span className="brand-symbol">SSJ</span>
          <span>Project SSJ</span>
        </button>
        <p className="nav-label">ANALYSIS</p>
        <nav className="side-nav" aria-label="주요 화면">
          {navItems.map(({ route: target, label, icon: Icon }) => (
            <button className={route === target ? "active" : ""} type="button" key={target} onClick={() => navigate(target)}>
              <Icon size={19} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-version">
          <BarChart3 size={15} />
          <span>Dashboard v2.1.0</span>
        </div>
      </aside>
      <section className="workspace">
        <header className="topbar">
          <strong>{pageTitle}</strong>
          <div className="topbar-actions">
            <button className="icon-button" type="button" aria-label="알림">
              <Bell size={18} />
            </button>
            <ProfileMenu user={user} onProfile={() => navigate(routes.user)} onLogin={() => navigate(routes.login)} onLogout={onLogout} />
          </div>
        </header>
        <main className="page-container">{children}</main>
      </section>
    </div>
  );
}
