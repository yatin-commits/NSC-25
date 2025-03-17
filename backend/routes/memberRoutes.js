const express = require("express");
const router = express.Router();
const Member = require("../modules/Members");
const cors = require('cors');
app.use(cors());
app.use(cors({
  origin: ['https://bvicam-nsc-25.vercel.app','http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT'], 
  allowedHeaders: ['Content-Type'], 
}));
// Generate and store a new member ID
router.post("/generate-member-id", async (req, res) => {
  const { name, email, phone, college } = req.body;

  if (!name || !email || !phone || !college) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check for duplicate phone number
    const existingPhone = await Member.findOne({ phone });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already registered",
      });
    }

    // Generate unique member ID
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let memberId;
    let isUnique = false;
    while (!isUnique) {
      memberId = "NSC";
      for (let i = 0; i < 4; i++) {
        memberId += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      const existingMember = await Member.findOne({ memberId });
      if (!existingMember) isUnique = true;
    }

    const member = new Member({ memberId, name, email, phone, college });
    await member.save();
    res.status(201).json({ success: true, memberId });
  } catch (error) {
    console.error("Error generating member ID:", error);
    if (error.code === 11000 && error.keyPattern.phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is already registered",
      });
    }
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Verify member IDs (unchanged from previous)
router.post("/verify-member-ids", async (req, res) => {
  const { memberIds } = req.body;

  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    return res.status(400).json({ success: false, message: "Member IDs array is required" });
  }

  try {
    const members = await Member.find({ memberId: { $in: memberIds } });
    const existingIds = members.map((m) => m.memberId);
    const invalidIds = memberIds.filter((id) => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid member IDs",
        invalidIds,
      });
    }

    const uniqueIds = new Set(memberIds);
    if (uniqueIds.size !== memberIds.length) {
      return res.status(400).json({
        success: false,
        message: "Duplicate member IDs provided",
      });
    }

    res.status(200).json({ success: true, message: "All member IDs are valid and unique" });
  } catch (error) {
    console.error("Error verifying member IDs:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;