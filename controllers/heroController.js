import { getSetting, setSetting } from "../config/db.js";

const HERO_MAIN_IMAGE = "hero_main_image";

export async function getHero(req, res) {
  const image = await getSetting(HERO_MAIN_IMAGE);
  return res.json({ image });
}

export async function updateHero(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: "Image file is required" });
  }
  await setSetting(HERO_MAIN_IMAGE, req.file.filename);
  return res.json({ image: req.file.filename });
}

export async function removeHero(req, res) {
  await setSetting(HERO_MAIN_IMAGE, "");
  return res.json({ image: "" });
}
