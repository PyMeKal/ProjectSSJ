import { useCallback, useState } from "react";

const STORAGE_KEY = "project-ssj-user";

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? null;
  } catch {
    return null;
  }
}

export function useSessionUser() {
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback((nextUser) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setUser(null);
  }, []);

  return { user, login, logout };
}
