import { Router } from "express";

export const appRoutes = {
  main: "/",
  analysis: "/analysis",
  time: "/analysis/time",
  keyword: "/analysis/keyword",
  users: "/analysis/users",
  login: "/login",
  user: "/user",
};

export function createAppRoutesRouter() {
  const router = Router();

  router.get("/", (req, res) => {
    res.json(appRoutes);
  });

  return router;
}
