import { validationResult } from "express-validator";
import ServiceRequest from "../models/ServiceRequest.js";
import Project from "../models/Project.js";
import Message from "../models/Message.js";

export const createServiceRequest = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  const { serviceId } = req.body;
  const sr = await ServiceRequest.create({ client: req.user._id, service: serviceId });
  res.status(201).json(sr);
};

export const listMyServiceRequests = async (req, res) => {
  const list = await ServiceRequest.find({ client: req.user._id }).populate("service");
  res.json(list);
};

export const listAllServiceRequests = async (_req, res) => {
  const list = await ServiceRequest.find().populate("client").populate("service").sort({ createdAt: -1 });
  res.json(list);
};

export const setApprovalStatus = async (req, res) => {
  const { status, reason } = req.body;
  const sr = await ServiceRequest.findById(req.params.id).populate("client").populate("service");
  if (!sr) return res.status(404).json({ message: "Service request not found" });
  if (!["Approved", "Rejected"].includes(status)) return res.status(400).json({ message: "Invalid status" });
  sr.approvalStatus = status;
  await sr.save();
  let createdProject = null;
  let rejectionMessage = null;
  if (status === "Approved") {
    if (!sr.service || !sr.client) {
      return res.status(400).json({ message: "Missing client or service for this request" });
    }
    createdProject = await Project.create({
      name: `${sr.service.name} for ${sr.client.name}`,
      description: sr.service.description || "",
      client: sr.client._id,
      status: "Pending"
    });
  } else if (status === "Rejected") {
    const polite = reason && String(reason).trim().length > 0
      ? `Hello ${sr.client.name}, thank you for your interest in ${sr.service?.name || "the requested service"}. After careful review, we’re unable to proceed at this time. Reason: ${reason}. Please feel free to reach out if you have any questions or would like to discuss alternatives.`
      : `Hello ${sr.client.name}, thank you for your interest in ${sr.service?.name || "the requested service"}. After careful review, we’re unable to proceed at this time. Please feel free to reach out if you have any questions or would like to discuss alternatives.`;
    rejectionMessage = await Message.create({
      sender: req.user._id,
      receiver: sr.client._id,
      text: polite,
    });
  }
  res.json({ serviceRequest: sr, project: createdProject, rejectionMessage });
};
