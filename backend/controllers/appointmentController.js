const express = require("express");
const Appointment = require("../models/appointment");
const authMiddleware = require("../middleware/authMiddleware");
const logAction = require("../utils/auditLogger");

const router = express.Router();

// Book an appointment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { doctorId, date } = req.body;
    const patientId = req.user.id;

    // Check for existing appointment at the same time
    const appointmentDate = new Date(date);
    const existingAppointment = await Appointment.findOne({
      doctorId,
      date: appointmentDate,
      status: { $ne: "CANCELLED" }
    });

    if (existingAppointment) {
      return res.status(400).json({ 
        message: "This time slot is already booked. Please choose another time." 
      });
    }

    const newAppointment = await Appointment.create({
      patientId,
      doctorId,
      date: appointmentDate,
    });

    await logAction(patientId, "BOOK_APPOINTMENT", `Booked appointment with Dr. ${doctorId} on ${date}`);

    // Populate the appointment before returning
    const populatedAppointment = await Appointment.findById(newAppointment._id)
      .populate("doctorId", "name specialization")
      .populate("patientId", "name");

    res.status(201).json(populatedAppointment);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


// Get appointments for user (patient or doctor)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let query = {};
    if (role === "PATIENT") {
      query = { patientId: userId };
    } else if (role === "DOCTOR") {
      query = { doctorId: userId };
    } else {
        // Admin sees all?
    }

    const appointments = await Appointment.find(query)
      .populate("patientId", "name email")
      .populate("doctorId", "name email")
      .sort({ date: 1 });

    res.status(200).json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

module.exports = router;
