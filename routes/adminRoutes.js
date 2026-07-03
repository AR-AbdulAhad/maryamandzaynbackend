import { Router } from "express";
import { login, addVideo, editVideo, removeVideo } from "../controllers/adminController.js";
import { verifyToken } from "../middleware/auth.js";
import { listAllVideos } from "../controllers/videoController.js";

const router = Router();

router.post("/login", login);
router.get("/videos", verifyToken, listAllVideos);
router.post("/videos", verifyToken, addVideo);
router.put("/videos/:id", verifyToken, editVideo);
router.delete("/videos/:id", verifyToken, removeVideo);

export default router;