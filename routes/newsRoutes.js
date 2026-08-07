import { Router } from "express";
import { listActiveNews, getNews } from "../controllers/newsController.js";

const router = Router();

router.get("/", listActiveNews);
router.get("/:id", getNews);

export default router;
