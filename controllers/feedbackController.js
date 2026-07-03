import {
  getAllFeedback,
  getApprovedFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../config/db.js";

export function listApprovedFeedback(req, res) {
  const list = getApprovedFeedback().map((f) => ({
    id: f.id,
    text: f.text,
    author: f.author,
    child_age: f.child_age,
    rating: f.rating,
    createdAt: f.createdAt,
  }));
  return res.json(list);
}

export function listAllFeedback(req, res) {
  const list = getAllFeedback().map((f) => ({
    id: f.id,
    text: f.text,
    author: f.author,
    child_age: f.child_age,
    rating: f.rating,
    status: f.status,
    createdAt: f.createdAt,
  }));
  return res.json(list);
}

export function submitFeedback(req, res) {
  const { text, author, child_age, rating } = req.body;
  if (!text || text.trim().length < 2) {
    return res.status(400).json({ error: "Feedback text is required" });
  }
  const feedback = createFeedback({ text, author, child_age, rating });
  return res.status(201).json({ feedback });
}

export function approveFeedback(req, res) {
  const feedback = updateFeedback(req.params.id, { status: "approved" });
  if (!feedback) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ feedback });
}

export function rejectFeedback(req, res) {
  const feedback = updateFeedback(req.params.id, { status: "rejected" });
  if (!feedback) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ feedback });
}

export function restoreFeedback(req, res) {
  const feedback = updateFeedback(req.params.id, { status: "pending" });
  if (!feedback) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ feedback });
}

export function removeFeedback(req, res) {
  const ok = deleteFeedback(req.params.id);
  if (!ok) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ message: "Deleted" });
}
