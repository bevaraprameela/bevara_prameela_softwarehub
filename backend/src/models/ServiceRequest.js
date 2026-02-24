import mongoose from "mongoose";

const ServiceRequestSchema = new mongoose.Schema(
  {
    client: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    approvalStatus: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    createdDate: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("ServiceRequest", ServiceRequestSchema);

