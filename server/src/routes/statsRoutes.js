import { Router } from "express";
import {
  getDailyStats,
  getHourlyStats,
  getSummary,
  getTopWords,
  getUserRanking,
} from "../services/statsService.js";

export function createStatsRouter(db) {
  const router = Router();

  router.get("/", (req, res) => {
    res.json({
      summary: getSummary(db),
      userRanking: getUserRanking(db),
      dailyStats: getDailyStats(db),
      hourlyStats: getHourlyStats(db),
      topWords: getTopWords(db),
    });
  });

  router.get("/summary", (req, res) => {
    res.json(getSummary(db));
  });

  router.get("/ranking", (req, res) => {
    res.json(getUserRanking(db));
  });

  return router;
}
