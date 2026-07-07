import { LogIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnalysisHub } from "./pages/AnalysisHub.jsx";
import { KeywordAnalysisPage } from "./pages/KeywordAnalysisPage.jsx";
import { MainPage } from "./pages/MainPage.jsx";
import { TimeAnalysisPage } from "./pages/TimeAnalysisPage.jsx";
import { routes } from "./routes.js";
import "./styles.css";

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
