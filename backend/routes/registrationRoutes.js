const express = require('express');
const router = express.Router();
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { v2: cloudinary } = require('cloudinary');
const nodemailer = require('nodemailer');
const Registration = require('../modules/registrationModule');
const Event = require('../modules/evetModules'); // Fixed typo
const Member = require('../modules/Members');
const logger = require('../utils/logger'); // Import the Winston logger

// Apply middleware
router.use(cors({
  origin: [process.env.ALLOWED_ROUTE_2, process.env.ALLOWED_ROUTE_1],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ limit: '10mb', extended: true }));

// Log all incoming requests
router.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.url}`);
  logger.debug(`Request body: ${JSON.stringify(req.body)}`);
  next();
});




// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.HOST_GMAIL,
    pass: process.env.HOST_PASSWORD,
  },
});

// Event-specific fields (unchanged)

const eventFields = {
  1: [{ name: "teamSize", type: "select", options: ["1", "2", "3", "4"] }],
  2: [{ name: "teamSize", type: "select", options: ["1", "2", "3", "4", "5"] }],
  3: [
    { name: "Society Name", type: "text" },
    { name: "teamSize", type: "select", options: ["14", "15", "16", "17", "18", "19", "20", "21", "22"] },
  ],
  4: [{ name: "teamSize", type: "select", options: ["4"] }],
  5: [{ name: "teamSize", type: "select", options: ["2"] }],
  6: [
    { name: "Society Name", type: "text" },
    { name: "teamSize", type: "select", options: ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"] },
  ],
  7: [],
  8: [{ name: "Device", type: "select", options: ["Mobile", "DSL"] }],
  9: [],
  10: [{ name: "teamSize", type: "select", options: ["6", "7", "8"] }],
  11: [{ name: "Movie Title", type: "text" }],
};

const eventsRequiringPayment = [4, 10]; 

const isTeamBasedEvent = (eventId) => {
  const fields = eventFields[eventId] || [];
  return fields.some(field => {
  const targetNames = ['teamSize', 'groupSize', 'castSize'];
  return targetNames.includes(field.name);
});
};

// Register for an event
router.post('/register', upload.single('paymentReceipt'), async (req, res) => {
  const { eventId, userId, fields, name, email } = req.body;
  let paymentReceiptUrl = null;

  logger.debug(`Register request - eventId: ${eventId}, userId: ${userId}, name: ${name}, email: ${email}`);
  logger.debug(`Uploaded file: ${req.file ? req.file.originalname : 'none'}`);

  if (!userId || !eventId || !name || !email || !fields) {
    logger.error('Missing required fields in registration request');
    return res.status(400).json({ error: 'All fields (eventId, userId, name, email, fields) are required' });
  }

  let parsedFields;
  try {
    parsedFields = JSON.parse(fields);
    logger.debug(`Parsed fields: ${JSON.stringify(parsedFields)}`);
  } catch (error) {
    logger.error(`Fields parsing error: ${error.message}`);
    return res.status(400).json({ error: 'Invalid fields format; must be valid JSON' });
  }

  if (!parsedFields.memberId || !parsedFields.memberId.trim()) {
    logger.error('Member ID is missing or empty');
    return res.status(400).json({ error: 'Member ID is required' });
  }

  const requiredFields = eventFields[eventId] || [];
  const missingFields = requiredFields.filter(field => 
    !parsedFields[field.name] || parsedFields[field.name].trim() === ""
  );
  
  if (missingFields.length > 0) {
    logger.error(`Missing or empty fields: ${missingFields.map(f => f.name).join(', ')}`);
    return res.status(400).json({ 
      error: 'Missing or empty required event-specific fields',
      missing: missingFields.map(f => f.name)
    });
  }

  if (isTeamBasedEvent(eventId)) {
    const sizeField = requiredFields.find(f => ['teamSize', 'groupSize', 'castSize'].includes(f.name));
    if (sizeField) {
      const teamSize = parseInt(parsedFields[sizeField.name]) || 0;
      if (teamSize > 1) {
        for (let i = 1; i <= teamSize - 1; i++) {
          if (!parsedFields[`teamMemberId${i}`]?.trim()) {
            logger.error(`Team Member ID ${i} (teamMemberId${i}) is missing`);
            return res.status(400).json({
              error: `Team Member ID ${i} (teamMemberId${i}) is required`,
            });
          }
        }
        for (let i = teamSize; parsedFields[`teamMemberId${i}`]; i++) {
          logger.error(`Extra team member ID (teamMemberId${i}) provided`);
          return res.status(400).json({ error: `Extra team member ID (teamMemberId${i}) provided` });
        }
      }
    }
  }

  if (eventsRequiringPayment.includes(Number(eventId))) {
    if (!req.file) {
      logger.error('Payment receipt file missing for event requiring payment');
      return res.status(400).json({ error: 'Payment receipt file is required for this event' });
    }
    try {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: 'nsc-25/receipts', public_id: `${Date.now()}-${req.file.originalname}` },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });
      paymentReceiptUrl = result.secure_url;
      if (!paymentReceiptUrl) {
        logger.error('Cloudinary returned no secure_url');
        throw new Error('Cloudinary returned no secure_url');
      }
      logger.info(`Cloudinary upload successful: ${paymentReceiptUrl}`);
    } catch (error) {
      logger.error(`Cloudinary upload error: ${error.message}`);
      return res.status(500).json({ error: 'Failed to upload payment receipt to Cloudinary' });
    }
  }

  try {
    const event = await Event.findOne({ eventId: Number(eventId) });
    if (!event) {
      logger.error(`Event not found: eventId ${eventId}`);
      return res.status(404).json({ error: 'Event not found' });
    }

    const registrationData = {
      eventId: Number(eventId),
      userId,
      name,
      email,
      fields: new Map(Object.entries(parsedFields)),
      paymentReceipt: paymentReceiptUrl,
      registeredAt: new Date(),
    };
    logger.debug(`Registration data: ${JSON.stringify(registrationData)}`);

    const registration = new Registration(registrationData);
    const savedRegistration = await registration.save();
    logger.info(`Registration saved: eventId ${eventId}, userId ${userId}`);

    const eventName = event.name || `Event ${eventId}`;
    const mailOptions = {
      from: `"NSC 25 Team" <${process.env.HOST_GMAIL}>`,
      to: email,
      subject: `Registration Confirmation for ${eventName}`,
      text: `Dear ${name},\n\nYou have successfully registered for ${eventName}!\n\nDetails:\n- Member ID: ${parsedFields.memberId}\n${
        paymentReceiptUrl ? `- Payment Receipt: ${paymentReceiptUrl}\n` : ''
      }- Registered At: ${new Date().toLocaleString()}\n\nThank you for participating!\n\nBest regards,\nNSC 25 Team`,
      html: `
        <h2>Registration Confirmation</h2>
        <h3>Dear ${name},</h3>
        <p>You have successfully registered for <strong>${eventName}</strong>!</p>
        <h3>Details:</h3>
        <ul>
          <li><strong>Member ID:</strong> ${parsedFields.memberId}</li>
          ${paymentReceiptUrl ? `<li><strong>Payment Receipt:</strong> <a href="${paymentReceiptUrl}" target="_blank">View Receipt</a></li>` : ''}
          <li><strong>Registered At:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        <p>Thank you for participating!</p>
        <p>Best regards,<br>NSC 25 Team</p>
      `,
    };

    logger.debug(`Sending email to: ${email}`);
    await transporter.sendMail(mailOptions).catch((error) => {
      logger.error(`Email sending failed: ${error.message}`);
    });
    logger.info(`Registration email sent to: ${email}`);

    res.status(201).json({
      message: 'Registration successful',
      registration: savedRegistration,
    });
  } catch (error) {
    if (error.code === 11000) {
      logger.error(`Duplicate registration: eventId ${eventId}, userId ${userId}`);
      return res.status(400).json({ error: 'You are already registered for this event' });
    }
    logger.error(`Registration save error: ${error.message}`);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Fetch all members and their events
router.get('/members', async (req, res) => {
  try {
    logger.info('Fetching all registrations and members');
    const registrations = await Registration.find();
    logger.debug(`Found ${registrations.length} registrations`);

    const events = await Event.find();
    const eventMap = new Map(events.map(e => [e.eventId, e.name]));
    logger.debug(`Found ${events.length} events`);

    const memberIds = new Set();
    registrations.forEach((reg) => {
      const fields = reg.fields instanceof Map ? Object.fromEntries(reg.fields) : reg.fields || {};
      if (fields.memberId) memberIds.add(fields.memberId);

      const sizeField = Object.keys(fields).find((key) =>
        ['teamSize', 'groupSize', 'castSize'].includes(key)
      );
      const teamSize = sizeField ? parseInt(fields[sizeField]) || 0 : 0;
      if (teamSize > 1) {
        for (let i = 1; i <= teamSize - 1; i++) {
          const teamMemberId = fields[`teamMemberId${i}`];
          if (teamMemberId) memberIds.add(teamMemberId);
        }
      }
    });
    logger.debug(`Collected ${memberIds.size} unique member IDs`);

    const members = await Member.find({ memberId: { $in: Array.from(memberIds) } });
    const memberMap = new Map(members.map(m => [m.memberId, { 
      name: m.name, 
      email: m.email, 
      college: m.college, 
      phone: m.phone 
    }]));
    logger.debug(`Found ${members.length} members`);

    const memberEvents = new Map();
    for (const reg of registrations) {
      const fields = reg.fields instanceof Map ? Object.fromEntries(reg.fields) : reg.fields || {};
      const eventId = reg.eventId;
      const eventName = eventMap.get(eventId) || `Event ${eventId}`;

      if (fields.memberId && memberMap.has(fields.memberId)) {
        if (!memberEvents.has(fields.memberId)) {
          memberEvents.set(fields.memberId, { events: new Set() });
        }
        memberEvents.get(fields.memberId).events.add(eventName);
      }

      const sizeField = Object.keys(fields).find((key) =>
        ['teamSize', 'groupSize', 'castSize'].includes(key)
      );
      const teamSize = sizeField ? parseInt(fields[sizeField]) || 0 : 0;
      if (teamSize > 1) {
        for (let i = 1; i <= teamSize - 1; i++) {
          const teamMemberId = fields[`teamMemberId${i}`];
          if (teamMemberId && memberMap.has(teamMemberId)) {
            if (!memberEvents.has(teamMemberId)) {
              memberEvents.set(teamMemberId, { events: new Set() });
            }
            memberEvents.get(teamMemberId).events.add(eventName);
          }
        }
      }
    }

    const result = Array.from(memberMap.entries()).map(([memberId, { name, email, college, phone }]) => ({
      memberId,
      name,
      email,
      college: college || "N/A",
      phone: phone || "N/A",
      events: memberEvents.has(memberId) ? Array.from(memberEvents.get(memberId).events).sort() : [],
    })).sort((a, b) => a.memberId.localeCompare(b.memberId));

    if (result.length === 0) {
      logger.info('No members found with registrations');
      return res.status(200).json({ message: 'No members found with registrations', data: [] });
    }

    logger.info(`Returning ${result.length} members with registrations`);
    res.status(200).json(result);
  } catch (error) {
    logger.error(`Fetch members error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch members', details: error.message });
  }
});



router.get('/registrations/all', async (req, res) => {
  const { userId, eventId } = req.query;

  logger.info(`Admin fetch registrations: userId ${userId}, eventId ${eventId || 'all'}`);

  if (!userId) {
    logger.error('User ID missing for admin registrations fetch');
    return res.status(401).json({ error: 'User ID required' });
  }

    if (userId !== "29BruJMxHXMB6mbdAZyvKVUixW13") {
      logger.error(`Unauthorized access attempt: userId ${userId}`);
      return res.status(403).json({ error: 'Unauthorized: Admin access required' });
    }

  try {
    let query = {};
    if (eventId) {
      query.eventId = Number(eventId);
    }

    const registrations = await Registration.find(query);
    logger.info(`Fetched ${registrations.length} registrations for admin`);
    res.status(200).json(registrations);
  } catch (error) {
    logger.error(`Fetch admin registrations error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

module.exports = router;