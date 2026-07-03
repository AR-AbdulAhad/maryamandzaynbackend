import crypto from "crypto";
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import initSqlJs from "sql.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DB_PATH = join(__dirname, "..", "data", "app.db");

let db;
let dbReady;

export async function initDB() {
  if (db) return;
  const SQL = await initSqlJs();
  if (existsSync(DB_PATH)) {
    const buffer = readFileSync(DB_PATH);
    db = new SQL.Database(buffer);
  } else {
    db = new SQL.Database();
  }
  db.run(`
    CREATE TABLE IF NOT EXISTS videos (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      youtubeUrl TEXT NOT NULL,
      youtubeId TEXT NOT NULL,
      thumbnail TEXT DEFAULT '',
      active INTEGER DEFAULT 1,
      "order" INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS feedback (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      author TEXT DEFAULT 'Anonymous',
      child_age TEXT DEFAULT NULL,
      rating INTEGER DEFAULT 5,
      status TEXT DEFAULT 'pending',
      createdAt TEXT DEFAULT (datetime('now'))
    )
  `);
  saveDB();
  dbReady = Promise.resolve();
}

async function ensureDB() {
  if (!db) {
    if (!dbReady) {
      dbReady = initDB();
    }
    await dbReady;
  }
}

function saveDB() {
  const dir = dirname(DB_PATH);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
  writeFileSync(DB_PATH, db.export());
}

function query(sql, params = []) {
  const stmt = db.prepare(sql);
  if (params.length) stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

/* ── Videos ── */

export async function getAllVideos() {
  await ensureDB();
  return query('SELECT * FROM videos ORDER BY "order" ASC');
}

export async function getActiveVideos() {
  await ensureDB();
  return query('SELECT * FROM videos WHERE active = 1 ORDER BY "order" ASC');
}

export async function getVideoById(id) {
  await ensureDB();
  const rows = query("SELECT * FROM videos WHERE id = ?", [id]);
  return rows.length ? rows[0] : null;
}

export async function createVideo(videoData) {
  await ensureDB();
  const id = crypto.randomUUID();
  const rows = query("SELECT COUNT(*) as cnt FROM videos");
  const order = rows[0].cnt + 1;
  db.run(
    'INSERT INTO videos (id, title, youtubeUrl, youtubeId, thumbnail, active, "order", createdAt) VALUES (?, ?, ?, ?, ?, ?, ?, datetime(\'now\'))',
    [id, videoData.title, videoData.youtubeUrl, videoData.youtubeId, videoData.thumbnail || "", 1, order]
  );
  saveDB();
  return await getVideoById(id);
}

export async function updateVideo(id, updates) {
  await ensureDB();
  const fields = [];
  const values = [];
  if (updates.title !== undefined) { fields.push("title = ?"); values.push(updates.title); }
  if (updates.youtubeUrl !== undefined) { fields.push("youtubeUrl = ?"); values.push(updates.youtubeUrl); }
  if (updates.youtubeId !== undefined) { fields.push("youtubeId = ?"); values.push(updates.youtubeId); }
  if (updates.thumbnail !== undefined) { fields.push("thumbnail = ?"); values.push(updates.thumbnail); }
  if (updates.active !== undefined) { fields.push("active = ?"); values.push(updates.active ? 1 : 0); }
  if (!fields.length) return await getVideoById(id);
  values.push(id);
  db.run(`UPDATE videos SET ${fields.join(", ")} WHERE id = ?`, values);
  saveDB();
  return await getVideoById(id);
}

export async function deleteVideo(id) {
  await ensureDB();
  const info = db.run("DELETE FROM videos WHERE id = ?", [id]);
  saveDB();
  return info.changes > 0;
}

/* ── Feedback ── */

export async function getAllFeedback() {
  await ensureDB();
  return query("SELECT * FROM feedback ORDER BY createdAt DESC");
}

export async function getApprovedFeedback() {
  await ensureDB();
  return query("SELECT * FROM feedback WHERE status = 'approved' ORDER BY createdAt DESC");
}

export async function getFeedbackById(id) {
  await ensureDB();
  const rows = query("SELECT * FROM feedback WHERE id = ?", [id]);
  return rows.length ? rows[0] : null;
}

export async function createFeedback(data) {
  await ensureDB();
  const id = crypto.randomUUID();
  db.run(
    "INSERT INTO feedback (id, text, author, child_age, rating, status, createdAt) VALUES (?, ?, ?, ?, ?, 'pending', datetime('now'))",
    [id, data.text, data.author || "Anonymous", data.child_age || null, data.rating || 5]
  );
  saveDB();
  return await getFeedbackById(id);
}

export async function updateFeedback(id, updates) {
  await ensureDB();
  const fields = [];
  const values = [];
  if (updates.status) { fields.push("status = ?"); values.push(updates.status); }
  if (!fields.length) return await getFeedbackById(id);
  values.push(id);
  db.run(`UPDATE feedback SET ${fields.join(", ")} WHERE id = ?`, values);
  saveDB();
  return await getFeedbackById(id);
}

export async function deleteFeedback(id) {
  await ensureDB();
  const info = db.run("DELETE FROM feedback WHERE id = ?", [id]);
  saveDB();
  return info.changes > 0;
}
