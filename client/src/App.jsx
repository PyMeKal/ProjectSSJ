import { useEffect, useMemo, useState } from "react";
import { AppShell } from "./components/AppShell.jsx";
import { useRoute } from "./hooks/useRoute.js";
import { useSessionUser } from "./hooks/useSessionUser.js";
import { AnalysisHub } from "./pages/AnalysisHub.jsx";
import { KeywordAnalysisPage } from "./pages/KeywordAnalysisPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { MainPage } from "./pages/MainPage.jsx";
import { TimeAnalysisPage } from "./pages/TimeAnalysisPage.jsx";
import { UserAnalysisPage } from "./pages/UserAnalysisPage.jsx";
import { UserPage } from "./pages/UserPage.jsx";
import { defaultRoutes } from "./routes.js";
import { getAppRoutes } from "./services/api.js";
import "./styles.css";

export default function App() {
  const [routes, setRoutes] = useState(defaultRoutes);
  const [route, navigate] = useRoute(routes);
  const { user, login, logout } = useSessionUser();

  useEffect(() => {
    let ignore = false;
    getAppRoutes().then((serverRoutes) => { if (!ignore) setRoutes({ ...defaultRoutes, ...serverRoutes }); }).catch(() => {});
    return () => { ignore = true; };
  }, []);

  const page = useMemo(() => {
    if (route === routes.analysis) return <AnalysisHub routes={routes} navigate={navigate} user={user} />;
    if (route === routes.time) return <TimeAnalysisPage routes={routes} navigate={navigate} />;
    if (route === routes.keyword) return <KeywordAnalysisPage routes={routes} navigate={navigate} />;
    if (route === routes.users) return <UserAnalysisPage routes={routes} navigate={navigate} />;
    if (route === routes.user) return <UserPage routes={routes} navigate={navigate} user={user} />;
    return <MainPage routes={routes} navigate={navigate} user={user} />;
  }, [route, routes, navigate, user]);

  if (route === routes.login) return <LoginPage routes={routes} navigate={navigate} onLogin={login} />;

  function handleLogout() {
    logout();
    navigate(routes.main);
  }

  return <AppShell route={route} routes={routes} navigate={navigate} user={user} onLogout={handleLogout}>{page}</AppShell>;
}
