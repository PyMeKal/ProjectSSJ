import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import db from "./models/index.js";
import { createStatsRouter } from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";

app.use(
  cors({
    origin: clientOrigin,
  }),
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, service: "ProjectSSJ API" });
});

app.use("/api/stats", createStatsRouter(db));

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "서버에서 오류가 발생했습니다." });
});

try {
  await db.sequelize.authenticate();

  app.listen(port, () => {
    console.log(`ProjectSSJ API listening on http://localhost:${port}`);
  });
} catch (error) {
  console.error("MySQL 연결에 실패했습니다.", error);
  process.exit(1);
}
