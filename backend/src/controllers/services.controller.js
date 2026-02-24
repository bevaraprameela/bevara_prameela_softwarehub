import { validationResult } from "express-validator";
import Service from "../models/Service.js";

export const createService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description, price } = req.body;
  const service = await Service.create({ name, description, price });
  res.status(201).json(service);
};

export const listServices = async (_req, res) => {
  const list = await Service.find().sort({ createdAt: -1 });
  res.json(list);
};

export const updateService = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { name, description, price } = req.body;
  const service = await Service.findById(req.params.id);
  if (!service) return res.status(404).json({ message: "Service not found" });
  if (name !== undefined) service.name = name;
  if (description !== undefined) service.description = description;
  if (price !== undefined) service.price = price;
  await service.save();
  res.json(service);
};

export const deleteService = async (req, res) => {
  const s = await Service.findById(req.params.id);
  if (!s) return res.status(404).json({ message: "Service not found" });
  await s.deleteOne();
  res.json({ success: true });
};

