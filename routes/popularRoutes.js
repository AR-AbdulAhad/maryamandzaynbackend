import { Router } from "express";
import {
  listPopularVideos,
  listAllPopularVideos,
  addPopularVideo,
  removePopularVideo,
} from "../controllers/popularController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get("/", listPopularVideos);
router.get("/all", verifyToken, listAllPopularVideos);
router.post("/", verifyToken, addPopularVideo);
router.delete("/:id", verifyToken, removePopularVideo);

export default router;
