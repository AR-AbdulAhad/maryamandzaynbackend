import { getActiveVideos, getAllVideos, getVideoById } from "../config/db.js";

function mapVideo(v) {
  return {
    id: v.id,
    title: v.title,
    type: v.type,
    youtubeId: v.youtubeId,
    youtubeUrl: v.youtubeUrl,
    thumbnail: v.thumbnail,
    media: v.media,
    active: v.active,
    order: v.order,
    createdAt: v.createdAt,
  };
}

export async function listActiveVideos(req, res) {
  const items = await getActiveVideos();
  return res.json({ videos: items.map(mapVideo) });
}

export async function listAllVideos(req, res) {
  const items = await getAllVideos();
  return res.json({ videos: items.map(mapVideo) });
}

export async function getVideo(req, res) {
  const video = await getVideoById(req.params.id);
  if (!video) return res.status(404).json({ error: "Video not found" });
  return res.json({ video: mapVideo(video) });
}