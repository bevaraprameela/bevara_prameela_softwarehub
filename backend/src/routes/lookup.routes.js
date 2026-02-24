import { Router } from "express";
import { auth } from "../middleware/auth.js";
import User from "../models/User.js";

const router = Router();

// Authenticated lookup by email for messaging convenience
router.get("/user-lookup", auth, async (req, res) => {
  const email = String(req.query.email || "").toLowerCase().trim();
  if (!email) return res.status(400).json({ message: "email is required" });
  const user = await User.findOne({ email }).select("_id name email role");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

export default router;

