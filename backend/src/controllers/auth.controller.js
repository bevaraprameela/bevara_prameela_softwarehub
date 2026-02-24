import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import User from "../models/User.js";
import crypto from "crypto";

function sign(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email, password } = req.body;
  const emailNorm = (email || "").toLowerCase().trim();
  const user = await User.findOne({ email: emailNorm });
  if (!user) return res.status(401).json({ message: "Invalid credentials" });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(401).json({ message: "Invalid credentials" });
  const token = sign(user);
  res.json({ token, user });
};

export const me = async (req, res) => {
  res.json({ user: req.user });
};

export const adminCreateUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, email, password, role, companyName } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ message: "Email already in use" });
  if (!["Employee", "Client"].includes(role)) return res.status(400).json({ message: "Invalid role" });
  const user = await User.create({ name, email, password, role, companyName });
  res.status(201).json(user);
};

export const updateProfile = async (req, res) => {
  const { name, companyName, profile } = req.body;
  req.user.name = name ?? req.user.name;
  req.user.companyName = companyName ?? req.user.companyName;
  req.user.profile = { ...(req.user.profile || {}), ...(profile || {}) };
  await req.user.save();
  res.json(req.user);
};

export const forgotPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(200).json({ success: true }); // do not reveal existence
  const token = crypto.randomBytes(20).toString("hex");
  user.resetToken = token;
  user.resetTokenExpires = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes
  await user.save();
  // In production, send email with the token link
  res.json({ success: true, tokenDemo: token });
};

export const resetPassword = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { token, password } = req.body;
  const user = await User.findOne({ resetToken: token, resetTokenExpires: { $gt: new Date() } });
  if (!user) return res.status(400).json({ message: "Invalid or expired token" });
  user.password = password;
  user.resetToken = undefined;
  user.resetTokenExpires = undefined;
  await user.save();
  res.json({ success: true });
};

export const googleInit = async (_req, res) => {
  res.status(501).json({ message: "Google OAuth not configured. Add credentials to enable." });
};
