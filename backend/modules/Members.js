const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true }, // Removed unique: true
  phone: { type: String, required: true, unique: true }, // Kept unique
  college: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Member", memberSchema);