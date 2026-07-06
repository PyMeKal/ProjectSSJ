import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { openDatabase } from "./db/database.js";
import { createStatsRouter } from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const port = Number(process.env.PORT ?? 4000);
const clientOrigin = process.env.CLIENT_ORIGIN ?? "http://localhost:5173";
const db = openDatabase();

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

app.listen(port, () => {
  console.log(`ProjectSSJ API listening on http://localhost:${port}`);
});
