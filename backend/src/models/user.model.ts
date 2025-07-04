import mongoose from "mongoose";

const macRequestSchema = new mongoose.Schema({
  mac: { type: String, required: true },
  requestedAt: { type: Date, default: Date.now },
  status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
});

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  password: { type: String, required: true }, // Hashed
  macAddresses: [{ type: String }], // Stores up to 3 approved MACs
  macRequests: [macRequestSchema]   // Stores request history
});

const User = mongoose.model("User", userSchema);
export default User;
