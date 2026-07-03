import { Router } from "express";
import { listActiveVideos, getVideo } from "../controllers/videoController.js";

const router = Router();

router.get("/", listActiveVideos);
router.get("/:id", getVideo);

export default router;