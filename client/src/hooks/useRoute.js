import { useCallback, useEffect, useState } from "react";

function getCurrentRoute(routes) {
  const path = window.location.pathname;
  return Object.values(routes).includes(path) ? path : routes.main;
}

export function useRoute(routes) {
  const [route, setRoute] = useState(() => getCurrentRoute(routes));

  useEffect(() => {
    const handlePopState = () => setRoute(getCurrentRoute(routes));
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [routes]);

  useEffect(() => {
    setRoute(getCurrentRoute(routes));
  }, [routes]);

  const navigate = useCallback((nextRoute) => {
    window.history.pushState({}, "", nextRoute);
    setRoute(nextRoute);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return [route, navigate];
}
