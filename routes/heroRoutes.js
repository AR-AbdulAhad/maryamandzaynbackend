import { Router } from "express";
import { getHero, updateHero, removeHero } from "../controllers/heroController.js";
import { verifyToken } from "../middleware/auth.js";
import { uploadImage } from "../middleware/upload.js";

const router = Router();

router.get("/", getHero);
router.post("/", verifyToken, uploadImage.single("image"), updateHero);
router.delete("/", verifyToken, removeHero);

export default router;
