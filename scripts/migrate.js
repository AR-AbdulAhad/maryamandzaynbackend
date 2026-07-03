import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, "..", "data");
const DB_PATH = join(DATA_DIR, "app.db");

async function migrate() {
  const SQL = await initSqlJs();
  const buffer = existsSync(DB_PATH) ? readFileSync(DB_PATH) : null;
  const db = buffer ? new SQL.Database(buffer) : new SQL.Database();

  // Ensure tables exist
  db.run(`CREATE TABLE IF NOT EXISTS videos (
    id TEXT PRIMARY KEY, title TEXT NOT NULL, youtubeUrl TEXT NOT NULL,
    youtubeId TEXT NOT NULL, thumbnail TEXT DEFAULT '',
    active INTEGER DEFAULT 1, "order" INTEGER DEFAULT 0,
    createdAt TEXT DEFAULT (datetime('now'))
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS feedback (
    id TEXT PRIMARY KEY, text TEXT NOT NULL, author TEXT DEFAULT 'Anonymous',
    child_age TEXT DEFAULT NULL, rating INTEGER DEFAULT 5,
    status TEXT DEFAULT 'pending', createdAt TEXT DEFAULT (datetime('now'))
  )`);

  // Migrate videos
  const videoFile = join(DATA_DIR, "videos.json");
  if (existsSync(videoFile)) {
    const { videos } = JSON.parse(readFileSync(videoFile, "utf-8"));
    for (const v of videos) {
      const stmt = db.prepare("SELECT id FROM videos WHERE id = ?");
      stmt.bind([v.id]);
      const exists = stmt.step();
      stmt.free();
      if (!exists) {
        db.run(
          'INSERT INTO videos (id, title, youtubeUrl, youtubeId, thumbnail, active, "order", createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
          [v.id, v.title, v.youtubeUrl, v.youtubeId, v.thumbnail || "", v.active ? 1 : 0, v.order, v.createdAt]
        );
      }
    }
    console.log(`Migrated ${videos.length} videos`);
  }

  // Migrate feedback
  const feedbackFile = join(DATA_DIR, "feedback.json");
  if (existsSync(feedbackFile)) {
    const feedback = JSON.parse(readFileSync(feedbackFile, "utf-8"));
    for (const f of feedback) {
      const stmt = db.prepare("SELECT id FROM feedback WHERE id = ?");
      stmt.bind([f.id]);
      const exists = stmt.step();
      stmt.free();
      if (!exists) {
        db.run(
          "INSERT INTO feedback (id, text, author, child_age, rating, status, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [f.id, f.text, f.author || "Anonymous", f.child_age, f.rating, f.status, f.createdAt]
        );
      }
    }
    console.log(`Migrated ${feedback.length} feedback entries`);
  }

  writeFileSync(DB_PATH, db.export());
  console.log("Migration complete!");
}

migrate().catch(console.error);
