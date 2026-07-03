import {
  getAllFeedback,
  getApprovedFeedback,
  createFeedback,
  updateFeedback,
  deleteFeedback,
} from "../config/db.js";

export async function listApprovedFeedback(req, res) {
  const items = await getApprovedFeedback();
  const list = items.map((f) => ({
    id: f.id,
    text: f.text,
    author: f.author,
    child_age: f.child_age,
    rating: f.rating,
    createdAt: f.createdAt,
  }));
  return res.json(list);
}

export async function listAllFeedback(req, res) {
  const items = await getAllFeedback();
  const list = items.map((f) => ({
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

export async function submitFeedback(req, res) {
  const { text, author, child_age, rating } = req.body;
  if (!text || text.trim().length < 2) {
    return res.status(400).json({ error: "Feedback text is required" });
  }
  const feedback = await createFeedback({ text, author, child_age, rating });
  return res.status(201).json({ feedback });
}

export async function approveFeedback(req, res) {
  const feedback = await updateFeedback(req.params.id, { status: "approved" });
  if (!feedback) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ feedback });
}

export async function rejectFeedback(req, res) {
  const feedback = await updateFeedback(req.params.id, { status: "rejected" });
  if (!feedback) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ feedback });
}

export async function restoreFeedback(req, res) {
  const feedback = await updateFeedback(req.params.id, { status: "pending" });
  if (!feedback) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ feedback });
}

export async function removeFeedback(req, res) {
  const ok = await deleteFeedback(req.params.id);
  if (!ok) return res.status(404).json({ error: "Feedback not found" });
  return res.json({ message: "Deleted" });
}
