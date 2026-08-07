import { Router } from "express";
import { login, addVideo, editVideo, removeVideo } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";
import { listAllVideos } from "../controllers/videoController.js";
import {
  listAllNews,
  addNews,
  editNews,
  removeNews,
} from "../controllers/newsController.js";
import { uploadImage, uploadMedia } from "../middleware/upload.js";

const router = Router();

router.post("/login", login);
router.get("/videos", verifyToken, listAllVideos);
router.post("/videos", verifyToken, uploadMedia.single("file"), addVideo);
router.put("/videos/:id", verifyToken, editVideo);
router.delete("/videos/:id", verifyToken, removeVideo);
router.get("/news", verifyToken, listAllNews);
router.post("/news", verifyToken, uploadImage.single("image"), addNews);
router.put("/news/:id", verifyToken, uploadImage.single("image"), editNews);
router.delete("/news/:id", verifyToken, removeNews);

export default router;