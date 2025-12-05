const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["PATIENT", "DOCTOR", "ADMIN"],
    default: "PATIENT",
  },
  specialization: { type: String },
  phone: { type: String },
  address: { type: String },
  about: { type: String },
  image: { type: String },
  // Doctor-specific fields
  fee: { type: Number, default: 500 },
  experience: { type: String },
  degree: { type: String },
  available: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
