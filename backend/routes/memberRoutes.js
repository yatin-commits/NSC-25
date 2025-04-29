const express = require("express");
const router = express.Router();
const Member = require("../modules/Members");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// CORS configuration
router.use(cors({
  origin: [process.env.ALLOWED_ROUTE_2, process.env.ALLOWED_ROUTE_1],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

router.use(express.json());

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.HOST_GMAIL,
    pass: process.env.HOST_PASSWORD,
  },
});

// Generate and store a new member ID, then send it via email
router.post("/generate-member-id", async (req, res) => {
  const { name, email, phone, college } = req.body;

  console.log("Request received:", { name, email, phone, college });

  if (!name || !email || !phone || !college) {
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check for duplicate email or phone number
    const existingMember = await Member.findOne({ $or: [{ email }, { phone }] });
    if (existingMember) {
      if (existingMember.email === email) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered",
        });
      }
      if (existingMember.phone === phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
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

    // Save member to database
    const member = new Member({ memberId, name, email, phone, college });
    await member.save();
    console.log("Member saved:", { memberId, email });

    // Send email with memberId
    const mailOptions = {
      from: `"NSC 25 Team"`,
      to: email,
      subject: "Your NSC 25 Member ID",
      text: `Dear ${name},\n\nThank you for registering with NSC 25! Your Member ID is: ${memberId}\n\nUse this ID to register for events.\n\nBest regards,\nNSC 25 Team`,
      html: `
        <h2>Welcome to NSC 25, ${name}!</h2>
        <p>Thank you for registering. Your Member ID is:</p>
        <h3 style="color: #4f46e5;">${memberId}</h3>
        <p>Use this ID to register for events.</p>
        <p>Best regards,<br>NSC 25 Team</p>
      `,
    };

    console.log("Sending email to:", email);
    const emailResult = await transporter.sendMail(mailOptions);
    console.log("Email sent successfully:", emailResult);

    // Respond to frontend
    res.status(201).json({ success: true, memberId });
  } catch (error) {
    console.error("Error in /generate-member-id:", error);
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        return res.status(400).json({
          success: false,
          message: "Email is already registered",
        });
      }
      if (error.keyPattern.phone) {
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Verify member IDs (unchanged)
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