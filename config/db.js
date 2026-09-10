import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export { prisma };

export async function initDB() {
  await prisma.$connect();
  console.log("Database connected via Prisma");
}

/* ── Videos ── */

export async function getAllVideos() {
  return prisma.video.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getActiveVideos() {
  return prisma.video.findMany({ where: { active: true }, orderBy: { createdAt: "desc" } });
}

export async function getVideoById(id) {
  return prisma.video.findUnique({ where: { id } });
}

export async function createVideo(videoData) {
  const count = await prisma.video.count();
  return prisma.video.create({
    data: {
      title: videoData.title,
      type: videoData.type || "youtube",
      youtubeUrl: videoData.youtubeUrl || null,
      youtubeId: videoData.youtubeId || null,
      thumbnail: videoData.thumbnail || "",
      media: videoData.media || null,
      order: count + 1,
    },
  });
}

export async function updateVideo(id, updates) {
  const data = {};
  if (updates.title !== undefined) data.title = updates.title;
  if (updates.type !== undefined) data.type = updates.type;
  if (updates.youtubeUrl !== undefined) data.youtubeUrl = updates.youtubeUrl;
  if (updates.youtubeId !== undefined) data.youtubeId = updates.youtubeId;
  if (updates.thumbnail !== undefined) data.thumbnail = updates.thumbnail;
  if (updates.media !== undefined) data.media = updates.media;
  if (updates.active !== undefined) data.active = updates.active;
  if (!Object.keys(data).length) return getVideoById(id);
  return prisma.video.update({ where: { id }, data }).catch(() => null);
}

export async function deleteVideo(id) {
  const result = await prisma.video.delete({ where: { id } }).catch(() => null);
  return result !== null;
}

/* ── Feedback ── */

export async function getAllFeedback() {
  return prisma.feedback.findMany({ orderBy: { createdAt: "desc" } });
}

export async function getApprovedFeedback() {
  return prisma.feedback.findMany({
    where: { status: "approved" },
    orderBy: { createdAt: "desc" },
  });
}

export async function getFeedbackById(id) {
  return prisma.feedback.findUnique({ where: { id } });
}

export async function createFeedback(data) {
  return prisma.feedback.create({
    data: {
      text: data.text,
      author: data.author || "Anonymous",
      childAge: data.child_age || data.childAge || null,
      rating: data.rating || 5,
      status: data.status || "pending",
    },
  });
}

export async function updateFeedback(id, updates) {
  const data = {};
  if (updates.status !== undefined) data.status = updates.status;
  if (!Object.keys(data).length) return getFeedbackById(id);
  return prisma.feedback.update({ where: { id }, data }).catch(() => null);
}

export async function deleteFeedback(id) {
  const result = await prisma.feedback.delete({ where: { id } }).catch(() => null);
  return result !== null;
}

/* ── Settings ── */

export async function getSetting(key) {
  const row = await prisma.setting.findUnique({ where: { key } });
  return row ? row.value : "";
}

export async function setSetting(key, value) {
  return prisma.setting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
}

/* ── News ── */

export async function getAllNews() {
  return prisma.news.findMany({ orderBy: { order: "asc" } });
}

export async function getActiveNews() {
  return prisma.news.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

export async function getNewsById(id) {
  return prisma.news.findUnique({ where: { id } });
}

export async function createNews(data) {
  const count = await prisma.news.count();
  return prisma.news.create({
    data: {
      title: data.title,
      description: data.description || "",
      image: data.image || "",
      tagline: data.tagline || "",
      buttonText: data.button_text || "",
      buttonLink: data.button_link || "",
      active: data.active ?? true,
      order: count + 1,
    },
  });
}

export async function updateNews(id, updates) {
  const data = {};
  if (updates.title !== undefined) data.title = updates.title;
  if (updates.description !== undefined) data.description = updates.description;
  if (updates.image !== undefined) data.image = updates.image;
  if (updates.tagline !== undefined) data.tagline = updates.tagline;
  if (updates.button_text !== undefined) data.buttonText = updates.button_text;
  if (updates.button_link !== undefined) data.buttonLink = updates.button_link;
  if (updates.active !== undefined) data.active = updates.active;
  if (!Object.keys(data).length) return getNewsById(id);
  return prisma.news.update({ where: { id }, data }).catch(() => null);
}

export async function deleteNews(id) {
  const result = await prisma.news.delete({ where: { id } }).catch(() => null);
  return result !== null;
}

/* ── Popular Videos ── */

export async function getActivePopularVideos() {
  return prisma.popularVideo.findMany({ where: { active: true }, orderBy: { order: "asc" } });
}

export async function getAllPopularVideos() {
  return prisma.popularVideo.findMany({ orderBy: { order: "asc" } });
}

export async function createPopularVideo(data) {
  const count = await prisma.popularVideo.count();
  return prisma.popularVideo.create({
    data: {
      title: data.title,
      youtubeUrl: data.youtubeUrl,
      youtubeId: data.youtubeId,
      thumbnail: data.thumbnail || "",
      order: count + 1,
    },
  });
}

export async function deletePopularVideo(id) {
  const result = await prisma.popularVideo.delete({ where: { id } }).catch(() => null);
  return result !== null;
}