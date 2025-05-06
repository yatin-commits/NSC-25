const express = require("express");
const router = express.Router();
const Member = require("../modules/Members");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const logger = require("../utils/logger"); // Import the Winston logger

dotenv.config();

// CORS configuration
router.use(cors({
  origin: [process.env.ALLOWED_ROUTE_2, process.env.ALLOWED_ROUTE_1],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

router.use(express.json());

// Log all incoming requests
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  logger.debug(`Request body: ${JSON.stringify(req.body)}`);
  next();
});

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

  logger.debug(`Generate member ID request: name=${name}, email=${email}, phone=${phone}, college=${college}`);

  if (!name || !email || !phone || !college) {
    logger.error("Missing required fields in generate-member-id request");
    return res.status(400).json({ success: false, message: "All fields are required" });
  }

  try {
    // Check for duplicate email or phone number
    const existingMember = await Member.findOne({ $or: [{ email }, { phone }] });
    if (existingMember) {
      if (existingMember.email === email) {
        logger.error(`Duplicate email detected: ${email}`);
        return res.status(400).json({
          success: false,
          message: "Email is already registered",
        });
      }
      if (existingMember.phone === phone) {
        logger.error(`Duplicate phone number detected: ${phone}`);
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
    logger.debug(`Generated unique member ID: ${memberId}`);

    // Save member to database
    const member = new Member({ memberId, name, email, phone, college });
    await member.save();
    logger.info(`Member saved: memberId=${memberId}, email=${email}`);

    // Send email with memberId
    const mailOptions = {
      from: `"NSC 25 Team" <${process.env.HOST_GMAIL}>`,
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

    logger.debug(`Sending email to: ${email}`);
    await transporter.sendMail(mailOptions);
    logger.info(`Email sent successfully to: ${email}`);

    // Respond to frontend
    res.status(201).json({ success: true, memberId });
  } catch (error) {
    logger.error(`Error in /generate-member-id: ${error.message}`);
    if (error.code === 11000) {
      if (error.keyPattern.email) {
        logger.error(`Duplicate email detected in database: ${email}`);
        return res.status(400).json({
          success: false,
          message: "Email is already registered",
        });
      }
      if (error.keyPattern.phone) {
        logger.error(`Duplicate phone number detected in database: ${phone}`);
        return res.status(400).json({
          success: false,
          message: "Phone number is already registered",
        });
      }
    }
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
});

// Verify member IDs
router.post("/verify-member-ids", async (req, res) => {
  const { memberIds } = req.body;

  logger.debug(`Verify member IDs request: memberIds=${JSON.stringify(memberIds)}`);

  if (!Array.isArray(memberIds) || memberIds.length === 0) {
    logger.error("Member IDs array is missing or empty");
    return res.status(400).json({ success: false, message: "Member IDs array is required" });
  }

  try {
    const members = await Member.find({ memberId: { $in: memberIds } });
    const existingIds = members.map((m) => m.memberId);
    const invalidIds = memberIds.filter((id) => !existingIds.includes(id));

    if (invalidIds.length > 0) {
      logger.error(`Invalid member IDs: ${invalidIds.join(", ")}`);
      return res.status(400).json({
        success: false,
        message: "Invalid member IDs",
        invalidIds,
      });
    }

    const uniqueIds = new Set(memberIds);
    if (uniqueIds.size !== memberIds.length) {
      logger.error("Duplicate member IDs provided");
      return res.status(400).json({
        success: false,
        message: "Duplicate member IDs provided",
      });
    }

    logger.info(`Verified ${memberIds.length} member IDs successfully`);
    res.status(200).json({ success: true, message: "All member IDs are valid and unique" });
  } catch (error) {
    logger.error(`Error verifying member IDs: ${error.message}`);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;