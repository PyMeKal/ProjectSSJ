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

  router.get("/", async (req, res, next) => {
    try {
      const [summary, userRanking, dailyStats, hourlyStats, topWords] = await Promise.all([
        getSummary(db),
        getUserRanking(db),
        getDailyStats(db),
        getHourlyStats(db),
        getTopWords(db),
      ]);

      res.json({
        summary,
        userRanking,
        dailyStats,
        hourlyStats,
        topWords,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get("/summary", async (req, res, next) => {
    try {
      res.json(await getSummary(db));
    } catch (error) {
      next(error);
    }
  });

  router.get("/ranking", async (req, res, next) => {
    try {
      res.json(await getUserRanking(db));
    } catch (error) {
      next(error);
    }
  });

  return router;
}
