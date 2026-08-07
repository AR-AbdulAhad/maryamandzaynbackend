import {
  getAllNews,
  getActiveNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../config/db.js";

export async function listActiveNews(req, res) {
  const items = await getActiveNews();
  const list = items.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    image: n.image,
    tagline: n.tagline,
    button_text: n.button_text,
    button_link: n.button_link,
    order: n.order,
  }));
  return res.json({ news: list });
}

export async function listAllNews(req, res) {
  const items = await getAllNews();
  const list = items.map((n) => ({
    id: n.id,
    title: n.title,
    description: n.description,
    image: n.image,
    tagline: n.tagline,
    button_text: n.button_text,
    button_link: n.button_link,
    active: n.active,
    order: n.order,
    createdAt: n.createdAt,
  }));
  return res.json({ news: list });
}

export async function getNews(req, res) {
  const item = await getNewsById(req.params.id);
  if (!item) return res.status(404).json({ error: "News item not found" });
  return res.json({ news: item });
}

export async function addNews(req, res) {
  const { title, description, tagline, button_text, button_link, active } = req.body;
  if (!title || !title.trim()) {
    return res.status(400).json({ error: "Title is required" });
  }
  const image = req.file ? req.file.filename : (req.body.image || "");
  const news = await createNews({
    title,
    description,
    image,
    tagline,
    button_text,
    button_link,
    active: active === false || active === "false" ? false : true,
  });
  return res.status(201).json({ news });
}

export async function editNews(req, res) {
  const { title, description, tagline, button_text, button_link, active } = req.body;
  const updates = {};
  if (title !== undefined) updates.title = title;
  if (description !== undefined) updates.description = description;
  if (req.file) updates.image = req.file.filename;
  else if (req.body.image !== undefined) updates.image = req.body.image;
  if (tagline !== undefined) updates.tagline = tagline;
  if (button_text !== undefined) updates.button_text = button_text;
  if (button_link !== undefined) updates.button_link = button_link;
  if (active !== undefined) updates.active = active === false || active === "false" ? false : true;
  const news = await updateNews(req.params.id, updates);
  if (!news) return res.status(404).json({ error: "News item not found" });
  return res.json({ news });
}

export async function removeNews(req, res) {
  const ok = await deleteNews(req.params.id);
  if (!ok) return res.status(404).json({ error: "News item not found" });
  return res.json({ message: "Deleted" });
}
