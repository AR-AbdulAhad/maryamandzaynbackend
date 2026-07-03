import "dotenv/config";
import express from "express";
import cors from "cors";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import { existsSync } from "fs";
import videoRoutes from "./routes/videoRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import feedbackRoutes from "./routes/feedbackRoutes.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: [
    "http://localhost:5173", "http://localhost:4173", "http://localhost:3001",
    "https://maryamandzayn.com", "https://www.maryamandzayn.com",
    "https://api.maryamandzayn.com",
  ],
  credentials: true,
}));
app.use(express.json());
app.use("/uploads", express.static(join(__dirname, "uploads")));

const publicPath = join(__dirname, "..", "dist");

app.use("/api/videos", videoRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/feedback", feedbackRoutes);

app.get("/admin", (req, res) => {
  res.sendFile(join(__dirname, "public", "admin.html"));
});

if (existsSync(publicPath)) {
  app.use(express.static(publicPath));
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.sendFile(join(publicPath, "index.html"));
    }
  });
} else {
  app.get("*", (req, res) => {
    if (!req.path.startsWith("/api")) {
      res.status(200).json({ message: "Maryam & Zayn API is running" });
    }
  });
}

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});