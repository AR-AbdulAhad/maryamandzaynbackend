import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { initDB } from "./config/db.js";
import videoRoutes from "./routes/videoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";
import newsRoutes from "./routes/newsRoutes.js";
import popularRoutes from "./routes/popularRoutes.js";
import heroRoutes from "./routes/heroRoutes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.set("trust proxy", 1);

app.use(helmet());

const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",").map(s => s.trim())
  : [
    "http://localhost:5173",
    "http://localhost:3000",
    "https://learning.maryamandzayn.com"
  ];
app.use(cors({ origin: corsOrigins, credentials: true }));

app.use(express.json({ limit: "1mb" }));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/", limiter);

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { error: "Too many login attempts" },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use("/api/admin/login", loginLimiter);

app.use("/uploads", express.static(join(__dirname, "uploads")));
app.use("/api/videos", videoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/news", newsRoutes);
app.use("/api/popular", popularRoutes);
app.use("/api/hero", heroRoutes);

app.get("/admin", (req, res) => {
  res.sendFile(join(__dirname, "public", "admin.html"));
});

app.get("*", (req, res) => {
  if (!req.path.startsWith("/api")) {
    res.json({ message: "Maryam & Zayn API is running" });
  }
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err.message);
  if (err.name === "MulterError") {
    return res.status(400).json({ error: `Upload failed: ${err.message}` });
  }
  res.status(500).json({ error: "Internal server error" });
});

async function start() {
  await initDB();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}
start();
