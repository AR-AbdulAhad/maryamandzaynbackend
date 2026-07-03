import { getActiveVideos, getAllVideos, getVideoById } from "../config/db.js";

export function listActiveVideos(req, res) {
  const videos = getActiveVideos().map((v) => ({
    id: v.id,
    title: v.title,
    youtubeId: v.youtubeId,
    youtubeUrl: v.youtubeUrl,
    thumbnail: v.thumbnail,
    order: v.order,
  }));
  return res.json({ videos });
}

export function listAllVideos(req, res) {
  const videos = getAllVideos().map((v) => ({
    id: v.id,
    title: v.title,
    youtubeId: v.youtubeId,
    youtubeUrl: v.youtubeUrl,
    thumbnail: v.thumbnail,
    active: v.active,
    order: v.order,
    createdAt: v.createdAt,
  }));
  return res.json({ videos });
}

export function getVideo(req, res) {
  const video = getVideoById(req.params.id);
  if (!video) return res.status(404).json({ error: "Video not found" });
  return res.json({ video });
}
