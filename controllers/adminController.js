import { generateToken } from "../middleware/auth.js";
import { createVideo, updateVideo, deleteVideo, getVideoById } from "../config/db.js";
import { extractYoutubeId } from "../utils/youtube.js";
import { existsSync, unlinkSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = join(__dirname, "..", "uploads");

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

function deleteUploadedFile(filename) {
  if (!filename) return;
  const filePath = join(UPLOAD_DIR, filename);
  try {
    if (existsSync(filePath)) unlinkSync(filePath);
  } catch (e) {
    // ignore
  }
}

export async function addVideo(req, res) {
  const { title, type, youtubeUrl } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }

  const mediaType = type === "image" || type === "video" ? type : "youtube";

  if (mediaType === "youtube") {
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
    });
    return res.status(201).json({ video });
  }

  if (!req.file) {
    return res.status(400).json({ error: "Image or video file is required" });
  }
  const isImage = req.file.mimetype.startsWith("image/");
  const isVideo = req.file.mimetype.startsWith("video/");
  if ((mediaType === "image" && !isImage) || (mediaType === "video" && !isVideo)) {
    return res.status(400).json({ error: "File type does not match the selected media type" });
  }
  const video = await createVideo({
    title,
    type: mediaType,
    media: req.file.filename,
  });
  return res.status(201).json({ video });
}

export async function editVideo(req, res) {
  const { title, type, youtubeUrl, thumbnail, active, media } = req.body;
  const updates = {};
  if (title) updates.title = title;
  if (type) {
    if (type !== "youtube" && type !== "image" && type !== "video") {
      return res.status(400).json({ error: "Invalid media type" });
    }
    updates.type = type;
  }
  if (youtubeUrl) {
    const youtubeId = extractYoutubeId(youtubeUrl);
    if (!youtubeId) return res.status(400).json({ error: "Invalid YouTube URL" });
    updates.youtubeUrl = youtubeUrl;
    updates.youtubeId = youtubeId;
  }
  if (media !== undefined) updates.media = media;
  if (thumbnail !== undefined) updates.thumbnail = thumbnail;
  if (active !== undefined) updates.active = active;
  const video = await updateVideo(req.params.id, updates);
  if (!video) return res.status(404).json({ error: "Video not found" });
  return res.json({ video });
}

export async function removeVideo(req, res) {
  const existing = await getVideoById(req.params.id);
  if (!existing) return res.status(404).json({ error: "Video not found" });
  if (existing.media) deleteUploadedFile(existing.media);
  const ok = await deleteVideo(req.params.id);
  if (!ok) return res.status(404).json({ error: "Video not found" });
  return res.json({ message: "Deleted" });
}
