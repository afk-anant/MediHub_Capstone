const express = require("express");
const multer = require("multer");
const PatientRecord = require("../models/patientRecord");
const authMiddleware = require("../middleware/authMiddleware");
const logAction = require("../utils/auditLogger");

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// Upload a record
router.post("/:id/records", authMiddleware, upload.single("file"), async (req, res) => {
  try {
    const patientId = req.params.id;
    // Ensure the user is uploading for themselves or is a doctor/admin (logic can be refined)
    if (req.user.id !== patientId && req.user.role === "PATIENT") {
        return res.status(403).json({ message: "Unauthorized" });
    }

    const { description } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const newRecord = await PatientRecord.create({
      patientId,
      filename: file.originalname,
      fileUrl: file.path, // In a real app, upload to S3/Cloudinary and store URL
      fileType: file.mimetype,
      description,
    });

    await logAction(req.user.id, "UPLOAD_RECORD", `Uploaded record: ${file.originalname}`);

    res.status(201).json(newRecord);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get all records for a patient
router.get("/:id/records", authMiddleware, async (req, res) => {
  try {
    const patientId = req.params.id;
    
    // Authorization check
    if (req.user.id !== patientId && req.user.role === "PATIENT") {
        // Check for consent (to be implemented)
        return res.status(403).json({ message: "Unauthorized" });
    }

    const records = await PatientRecord.find({ patientId }).sort({ uploadedAt: -1 });
    res.status(200).json(records);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Share record with a doctor
router.post("/:recordId/share", authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.body;
    const record = await PatientRecord.findOne({ _id: req.params.recordId, patientId: req.user.id });

    if (!record) return res.status(404).json({ message: "Record not found" });

    if (!record.sharedWith.includes(doctorId)) {
      record.sharedWith.push(doctorId);
      await record.save();
      await logAction(req.user.id, "SHARE_RECORD", `Shared record ${record.filename} with doctor ${doctorId}`);
    }

    res.status(200).json({ message: "Record shared successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Revoke access
router.post("/:recordId/revoke", authMiddleware, async (req, res) => {
  try {
    const { doctorId } = req.body;
    const record = await PatientRecord.findOne({ _id: req.params.recordId, patientId: req.user.id });

    if (!record) return res.status(404).json({ message: "Record not found" });

    record.sharedWith = record.sharedWith.filter(id => id.toString() !== doctorId);
    await record.save();
    await logAction(req.user.id, "REVOKE_ACCESS", `Revoked access for doctor ${doctorId} to record ${record.filename}`);

    res.status(200).json({ message: "Access revoked successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
