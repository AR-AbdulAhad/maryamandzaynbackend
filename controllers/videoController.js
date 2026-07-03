import { getActiveVideos, getAllVideos, getVideoById } from "../config/db.js";

export async function listActiveVideos(req, res) {
  const items = await getActiveVideos();
  const videos = items.map((v) => ({
    id: v.id,
    title: v.title,
    youtubeId: v.youtubeId,
    youtubeUrl: v.youtubeUrl,
    thumbnail: v.thumbnail,
    order: v.order,
  }));
  return res.json({ videos });
}

export async function listAllVideos(req, res) {
  const items = await getAllVideos();
  const videos = items.map((v) => ({
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

export async function getVideo(req, res) {
  const video = await getVideoById(req.params.id);
  if (!video) return res.status(404).json({ error: "Video not found" });
  return res.json({ video });
}
