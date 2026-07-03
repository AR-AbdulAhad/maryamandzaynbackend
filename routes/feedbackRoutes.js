import { Router } from "express";
import {
  listApprovedFeedback,
  listAllFeedback,
  submitFeedback,
  approveFeedback,
  rejectFeedback,
  restoreFeedback,
  removeFeedback,
} from "../controllers/feedbackController.js";
import { verifyToken } from "../middleware/auth.js";

const router = Router();

router.get("/approved", listApprovedFeedback);
router.post("/", submitFeedback);
router.get("/", verifyToken, listAllFeedback);
router.patch("/:id/approve", verifyToken, approveFeedback);
router.patch("/:id/reject", verifyToken, rejectFeedback);
router.patch("/:id/restore", verifyToken, restoreFeedback);
router.delete("/:id", verifyToken, removeFeedback);

export default router;
