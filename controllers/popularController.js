import {
  getActivePopularVideos,
  getAllPopularVideos,
  createPopularVideo,
  deletePopularVideo,
} from "../config/db.js";
import { extractYoutubeId } from "../utils/youtube.js";

export async function listPopularVideos(req, res) {
  const items = await getActivePopularVideos();
  const list = items.map((v) => ({
    id: v.id,
    youtubeId: v.youtubeId,
    title: v.title,
    thumbnail: v.thumbnail,
  }));
  return res.json({ videos: list });
}

export async function listAllPopularVideos(req, res) {
  const items = await getAllPopularVideos();
  return res.json({ videos: items });
}

export async function addPopularVideo(req, res) {
  const { title, youtubeUrl, thumbnail } = req.body;
  if (!title || !youtubeUrl) {
    return res.status(400).json({ error: "Title and YouTube URL are required" });
  }
  const youtubeId = extractYoutubeId(youtubeUrl);
  if (!youtubeId) {
    return res.status(400).json({ error: "Invalid YouTube URL" });
  }
  const video = await createPopularVideo({
    title,
    youtubeUrl,
    youtubeId,
    thumbnail: thumbnail || "",
  });
  return res.status(201).json({ video });
}

export async function removePopularVideo(req, res) {
  const ok = await deletePopularVideo(req.params.id);
  if (!ok) return res.status(404).json({ error: "Video not found" });
  return res.json({ message: "Deleted" });
}
