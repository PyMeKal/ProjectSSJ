import { Router } from "express";
import { getKeywordParticipation } from "../services/stats/keywordAnalysisService.js";
import { getTimeParticipation } from "../services/stats/timeAnalysisService.js";

export function createStatsRouter(db) {
  const router = Router();

  // Time analysis: sender participation ratio for a day, month, year, or all messages.
  router.get("/time", async (req, res, next) => {
    try {
      res.json(await getTimeParticipation(db, req.query));
    } catch (error) {
      next(error);
    }
  });

  // Keyword analysis: sender ratio among messages that contain the requested keyword.
  router.get("/keyword", async (req, res, next) => {
    try {
      res.json(await getKeywordParticipation(db, req.query));
    } catch (error) {
      next(error);
    }
  });

  // A small index response makes it clear which analysis endpoints exist.
  router.get("/", (req, res) => {
    res.json({
      endpoints: {
        time: "/api/stats/time?scope=day&date=YYYY-MM-DD",
        keyword: "/api/stats/keyword?keyword=검색어",
      },
    });
  });

  return router;
}
