import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 3 },
  description: { type: String, required: true, minlength: 10 },
  type: { type: String, enum: ["lost", "found"], required: true },
  date: { type: Date, required: true },
  contact: { type: String, required: true },
  image: { type: String },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    address: { type: String }
  },
  claimed: { type: Boolean, default: false },
  claimedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  approved: { type: Boolean, default: true },
  verified: { type: Boolean, default: false }
});

export default mongoose.model("Item", itemSchema);