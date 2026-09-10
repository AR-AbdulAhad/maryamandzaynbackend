import { generateToken } from "../middleware/auth.js";
import { createVideo, updateVideo, deleteVideo } from "../config/db.js";
import { extractYoutubeId } from "../utils/youtube.js";

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
  const { title, type, youtubeUrl, thumbnail } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const videoType = type || "youtube";

  if (videoType === "youtube") {
    if (!youtubeUrl) {
      return res.status(400).json({ error: "YouTube URL is required" });
    }
    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) {
      return res.status(400).json({ error: "Invalid YouTube URL" });
    }
    const video = await createVideo({
      title,
      type: "youtube",
      youtubeUrl,
      youtubeId,
      thumbnail: thumbnail || "",
    });
    return res.status(201).json({ video });
  }

  if (videoType === "image" || videoType === "video") {
    if (!req.file) {
      return res.status(400).json({ error: "File is required for image/video" });
    }
    const video = await createVideo({
      title,
      type: videoType,
      media: req.file.filename,
      thumbnail: thumbnail || "",
    });
    return res.status(201).json({ video });
  }

  return res.status(400).json({ error: "Invalid type" });
}

export async function editVideo(req, res) {
  const { title, type, youtubeUrl, thumbnail, active, media } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (type !== undefined) updates.type = type;
  if (youtubeUrl) {
    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) return res.status(400).json({ error: "Invalid YouTube URL" });
    updates.youtubeUrl = youtubeUrl;
    updates.youtubeId = youtubeId;
  }
  if (req.file) updates.media = req.file.filename;
  else if (typeof media === "string") updates.media = media;
  if (thumbnail !== undefined) updates.thumbnail = thumbnail;
  if (active !== undefined) updates.active = active === "false" ? false : Boolean(active);
  const video = await updateVideo(req.params.id, updates);
  if (!video) return res.status(404).json({ error: "Video not found" });
  return res.json({ video });
}

export async function removeVideo(req, res) {
  const ok = await deleteVideo(req.params.id);
  if (!ok) return res.status(404).json({ error: "Video not found" });
  return res.json({ message: "Deleted" });
}