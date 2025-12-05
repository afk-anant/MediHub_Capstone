const mongoose = require("mongoose");

const patientRecordSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  fileUrl: { type: String, required: true },
  fileType: { type: String, required: true },
  description: { type: String },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  uploadedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PatientRecord", patientRecordSchema);
