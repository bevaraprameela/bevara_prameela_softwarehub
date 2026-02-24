import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedEmployees: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    createdDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("Project", ProjectSchema);

