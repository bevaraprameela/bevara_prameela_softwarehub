import { validationResult } from "express-validator";
import mongoose from "mongoose";
import Message from "../models/Message.js";
import User from "../models/User.js";

export const sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { receiverId, text } = req.body;
  const rid = String(receiverId || "").trim();
  if (!mongoose.Types.ObjectId.isValid(rid)) {
    return res.status(400).json({ message: "Invalid receiver id" });
  }
  const receiverUser = await User.findById(rid).select("_id");
  if (!receiverUser) {
    return res.status(404).json({ message: "Receiver not found" });
  }
  const msg = await Message.create({ sender: req.user._id, receiver: receiverUser._id, text });
  const io = req.app.get("io");
  if (io) {
    const payload = {
      _id: msg._id,
      sender: String(msg.sender),
      receiver: String(msg.receiver),
      text: msg.text,
      createdAt: msg.createdAt
    };
    io.to(String(receiverUser._id)).emit("message:new", payload);
    io.to(String(req.user._id)).emit("message:new", payload);
    io.to(String(receiverUser._id)).emit("threads:update");
    io.to(String(req.user._id)).emit("threads:update");
  }
  res.status(201).json(msg);
};

export const conversation = async (req, res) => {
  const otherId = String(req.params.otherUserId || "").trim();
  if (!mongoose.Types.ObjectId.isValid(otherId)) {
    return res.json([]); // empty if invalid id
  }
  const me = req.user._id;
  const thread = await Message.find({
    $or: [
      { sender: me, receiver: otherId },
      { sender: otherId, receiver: me }
    ]
  })
    .sort({ createdAt: 1 });
  res.json(thread);
};

export const listThreads = async (req, res) => {
  const me = req.user._id;
  const threads = await Message.aggregate([
    { $match: { $or: [{ sender: me }, { receiver: me }] } },
    {
      $project: {
        otherId: {
          $cond: [{ $eq: ["$sender", me] }, "$receiver", "$sender"]
        },
        text: 1,
        createdAt: 1,
        isUnread: {
          $cond: [
            { $and: [{ $eq: ["$receiver", me] }, { $eq: ["$readAt", null] }] },
            1,
            0
          ]
        }
      }
    },
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$otherId",
        lastMessageAt: { $first: "$createdAt" },
        lastText: { $first: "$text" },
        count: { $sum: 1 },
        unread: { $sum: "$isUnread" }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    { $unwind: "$user" },
    {
      $project: {
        otherId: "$_id",
        _id: 0,
        lastMessageAt: 1,
        lastText: 1,
        count: 1,
        unread: 1,
        user: { _id: "$user._id", name: "$user.name", email: "$user.email", role: "$user.role" }
      }
    },
    { $sort: { lastMessageAt: -1 } }
  ]);
  res.json(threads);
};

export const markRead = async (req, res) => {
  const otherId = String(req.params.otherUserId || "").trim();
  if (!mongoose.Types.ObjectId.isValid(otherId)) {
    return res.status(400).json({ message: "Invalid user id" });
  }
  const me = req.user._id;
  const result = await Message.updateMany(
    { sender: otherId, receiver: me, readAt: null },
    { $set: { readAt: new Date() } }
  );
  const io = req.app.get("io");
  if (io) {
    io.to(String(me)).emit("threads:update");
  }
  res.json({ updated: result.modifiedCount });
};
