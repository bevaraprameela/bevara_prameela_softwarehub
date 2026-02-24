import mongoose from "mongoose";

const ServiceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    price: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("Service", ServiceSchema);

