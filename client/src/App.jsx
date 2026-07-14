import { LogIn } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AnalysisHub } from "./pages/AnalysisHub.jsx";
import { KeywordAnalysisPage } from "./pages/KeywordAnalysisPage.jsx";
import { MainPage } from "./pages/MainPage.jsx";
import { TimeAnalysisPage } from "./pages/TimeAnalysisPage.jsx";
import { defaultRoutes } from "./routes.js";
import { getAppRoutes } from "./services/api.js";
import "./styles.css";

function getCurrentRoute(routes) {
  const path = window.location.pathname;
  if (Object.values(routes).includes(path)) return path;
  return routes.main;
}

function useRoute(routes) {
  const [route, setRoute] = useState(() => getCurrentRoute(routes));

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute(routes));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [routes]);

  useEffect(() => {
    setRoute(getCurrentRoute(routes));
  }, [routes]);

  const navigate = (nextRoute) => {
    window.history.pushState({}, "", nextRoute);
    setRoute(nextRoute);
  };

  return [route, navigate];
}

function Shell({ route, routes, navigate, children }) {
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
  const [routes, setRoutes] = useState(defaultRoutes);
  const [route, navigate] = useRoute(routes);

  useEffect(() => {
    let ignore = false;

    getAppRoutes()
      .then((serverRoutes) => {
        if (!ignore) setRoutes({ ...defaultRoutes, ...serverRoutes });
      })
      .catch(() => {
        if (!ignore) setRoutes(defaultRoutes);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const page = useMemo(() => {
    if (route === routes.analysis) return <AnalysisHub routes={routes} navigate={navigate} />;
    if (route === routes.time) return <TimeAnalysisPage routes={routes} navigate={navigate} />;
    if (route === routes.keyword) return <KeywordAnalysisPage routes={routes} navigate={navigate} />;
    return <MainPage routes={routes} navigate={navigate} />;
  }, [route, routes, navigate]);

  return (
    <Shell route={route} routes={routes} navigate={navigate}>
      {page}
    </Shell>
  );
}
