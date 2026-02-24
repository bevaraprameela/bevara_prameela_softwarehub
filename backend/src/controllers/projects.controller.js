import fs from "fs";
import path from "path";
import Project from "../models/Project.js";

export const listProjects = async (req, res) => {
  const role = req.user.role;
  let filter = {};
  if (role === "Client") {
    filter.client = req.user._id;
  } else if (role === "Employee") {
    filter.assignedEmployees = req.user._id;
  }
  const list = await Project.find(filter).populate("client").populate("assignedEmployees");
  res.json(list);
};

export const updateProjectDetails = async (req, res) => {
  // Admin only
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  const { name, description, status } = req.body;
  if (name !== undefined) project.name = name;
  if (description !== undefined) project.description = description;
  if (status !== undefined) project.status = status;
  await project.save();
  res.json(project);
};

export const setAssignedEmployees = async (req, res) => {
  // Admin only
  const { employeeIds } = req.body; // array
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  project.assignedEmployees = employeeIds || [];
  await project.save();
  res.json(project);
};

export const employeeUpdateStatus = async (req, res) => {
  // Employee can update status of assigned projects
  const project = await Project.findById(req.params.id);
  if (!project) return res.status(404).json({ message: "Project not found" });
  const isAssigned = project.assignedEmployees.map((id) => String(id)).includes(String(req.user._id));
  if (!isAssigned) return res.status(403).json({ message: "Not assigned to this project" });
  const { status } = req.body;
  if (!["Pending", "In Progress", "Completed"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }
  project.status = status;
  await project.save();
  res.json(project);
};

export const uploadProjectDocument = async (req, res) => {
  // Admin only
  const projectId = req.params.id;
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ filename: req.file.filename, path: `/uploads/projects/${projectId}/${req.file.filename}` });
};

