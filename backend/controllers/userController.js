const express = require("express");
const User = require("../models/user");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Get all doctors (with optional specialization filter)
router.get("/doctors", authMiddleware, async (req, res) => {
  try {
    const { specialization } = req.query;
    let query = { role: "DOCTOR" };
    
    if (specialization) {
      query.specialization = specialization;
    }

    const doctors = await User.find(query).select("-password");
    res.status(200).json(doctors);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Update user profile
router.put("/profile", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, phone, address, about, specialization, image } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address, about, specialization, image },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// Get specific doctor by ID (public or authenticated)
router.get("/doctors/:id", async (req, res) => {
  try {
    const doctor = await User.findOne({ 
      _id: req.params.id, 
      role: "DOCTOR" 
    }).select("-password");
    
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }
    
    res.status(200).json(doctor);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
});


module.exports = router;
