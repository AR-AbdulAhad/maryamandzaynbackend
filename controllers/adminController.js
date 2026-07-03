import { generateToken } from "../middleware/auth.js";
import { createVideo, updateVideo, deleteVideo } from "../config/db.js";

const ADMIN_USER = process.env.ADMIN_USER;
const ADMIN_PASS = process.env.ADMIN_PASS;
if (!ADMIN_USER || !ADMIN_PASS) {
  console.error("FATAL: ADMIN_USER and ADMIN_PASS must be set in environment");
  process.exit(1);
}

export function login(req, res) {
  const { username, password } = req.body;
  if (username === ADMIN_USER && password === ADMIN_PASS) {
    return res.json({ token: generateToken() });
  }
  return res.status(401).json({ error: "Invalid credentials" });
}

export async function addVideo(req, res) {
  const { title, youtubeUrl, thumbnail } = req.body;
  if (!title || !youtubeUrl) {
    return res.status(400).json({ error: "Title and YouTube URL are required" });
  }
  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeId) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }
  const video = await createVideo({
    title,
    youtubeUrl,
    youtubeId,
    thumbnail: thumbnail || "",
  });
  return res.status(201).json({ video });
}

export async function editVideo(req, res) {
  const { title, youtubeUrl, thumbnail, active } = req.body;
  const updates = {};
  if (title) updates.title = title;
  if (youtubeUrl) {
    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) return res.status(400).json({ error: "Invalid YouTube URL" });
    updates.youtubeUrl = youtubeUrl;
    updates.youtubeId = youtubeId;
  }
  if (thumbnail !== undefined) updates.thumbnail = thumbnail;
  if (active !== undefined) updates.active = active;
  const video = await updateVideo(req.params.id, updates);
  if (!video) return res.status(404).json({ error: "Video not found" });
  return res.json({ video });
}

export async function removeVideo(req, res) {
  const ok = await deleteVideo(req.params.id);
  if (!ok) return res.status(404).json({ error: "Video not found" });
  return res.json({ message: "Deleted" });
}

function extractYoutubeId(url) {
  if (!url) return null;
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]+)/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}
