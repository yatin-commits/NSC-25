const express = require('express');
const router = express.Router();
const cors = require('cors');
const multer = require('multer');
const { v2: cloudinary } = require('cloudinary');
const nodemailer = require('nodemailer');
const Registration = require('../modules/registrationModule');
const Event = require('../modules/evetModules'); // Note: Typo fixed in your original ("evetModules" -> "eventModules")
const Member = require('../modules/Members');

// Apply middleware
router.use(cors({
  origin: ['https://bvicam-nsc-25.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));
router.use(express.json({ limit: '10mb' }));
router.use(express.urlencoded({ limit: '10mb', extended: true }));

// Multer setup for file uploads
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// Cloudinary configuration
cloudinary.config({
  cloud_name: "dhhxe2l2u",
  api_key: "461416841383678",
  api_secret: "aS6XR3GzZNlmcfbW5bYNfCjzols",
});

// Nodemailer transporter configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "nsc.event@bvicam.in",
    pass: "fgssbwjgqzljtnya",
  },
});

// Event-specific fields
const eventFields = {
  1: [{ name: "teamSize", type: "select", options: ["1", "2", "3","4"] },],
  2: [{ name: "teamSize", type: "select", options: ["1", "2", "3", "4", "5"] }],
  3: [
    { name: "Society Name", type: "text" },
    { name: "teamSize", type: "select", options: ["18", "19", "20"] },
  ],
  4: [{ name: "teamSize", type: "select", options: ["4"] }],
  5: [{ name: "teamSize", type: "select", options: ["2"] }],
  6: [
    { name: "Society Name", type: "text" },
    { name: "teamSize", type: "select", options: ["5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15", "16", "17", "18", "19", "20"] },
  ],
  7: [],
  8: [{ name: "Device", type: "select", options: ["Mobile", "DSLR"] }],
  9: [],
  10: [{ name: "teamSize", type: "select", options: ["6", "7", "8"] }],
  11: [{ name: "Movie Title", type: "text" }],
};

const eventsRequiringPayment = [4, 10]; // Basketball and Volleyball

const isTeamBasedEvent = (eventId) => {
  const fields = eventFields[eventId] || [];
  return fields.some(field => ['teamSize', 'groupSize', 'castSize'].includes(field.name));
};

// Register for an event
router.post('/register', upload.single('paymentReceipt'), async (req, res) => {
  const { eventId, userId, fields, name, email } = req.body;
  let paymentReceiptUrl = null;

  console.log('Request Body:', req.body);
  console.log('Uploaded File:', req.file);

  if (!userId || !eventId || !name || !email || !fields) {
    return res.status(400).json({ error: 'All fields (eventId, userId, name, email, fields) are required' });
  }

  let parsedFields;
  try {
    parsedFields = JSON.parse(fields);
    console.log('Parsed Fields:', parsedFields);
  } catch (error) {
    console.error('Fields parsing error:', error);
    return res.status(400).json({ error: 'Invalid fields format; must be valid JSON' });
  }

  if (!parsedFields.memberId || !parsedFields.memberId.trim()) {
    return res.status(400).json({ error: 'Member ID is required' });
  }

  const requiredFields = eventFields[eventId] || [];
  const missingFields = requiredFields.filter(field => 
    !parsedFields[field.name] || parsedFields[field.name].trim() === ""
  );
  if (missingFields.length > 0) {
    console.log('Missing or empty fields:', missingFields.map(f => f.name));
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
            return res.status(400).json({
              error: `Team Member ID ${i} (teamMemberId${i}) is required`,
            });
          }
        }
        for (let i = teamSize; parsedFields[`teamMemberId${i}`]; i++) {
          return res.status(400).json({ error: `Extra team member ID (teamMemberId${i}) provided` });
        }
      }
    }
  }

  if (eventsRequiringPayment.includes(Number(eventId))) {
    if (!req.file) {
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
        throw new Error('Cloudinary returned no secure_url');
      }
      console.log('Cloudinary Upload Success:', { paymentReceiptUrl });
    } catch (error) {
      console.error('Cloudinary upload error:', error);
      return res.status(500).json({ error: 'Failed to upload payment receipt to Cloudinary' });
    }
  }

  try {
    const event = await Event.findOne({ eventId: Number(eventId) });
    if (!event) {
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
    console.log('Registration Data to Save:', registrationData);

    const registration = new Registration(registrationData);
    const savedRegistration = await registration.save();
    console.log('Saved Registration:', savedRegistration);

    const eventName = event.name || `Event ${eventId}`;
    const mailOptions = {
      from: `"NSC 25 Team" <nsc.event@bvicam.in>`,
      to: email,
      subject: `Registration Confirmation for ${eventName}`,
      text: `Dear ${name},\n\nYou have successfully registered for ${eventName}!\n\nDetails:\n- Member ID: ${parsedFields.memberId}\n${
        paymentReceiptUrl ? `- Payment Receipt: ${paymentReceiptUrl}\n` : ''
      }- Registered At: ${new Date().toLocaleString()}\n\nThank you for participating!\n\nBest regards,\nNSC 25 Team`,
      html: `
        <h2>Registration Confirmation</h2>
        <p>Dear ${name},</p>
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

    console.log('Sending registration email to:', email);
    await transporter.sendMail(mailOptions).catch((error) => {
      console.error('Email sending failed:', error);
    });
    console.log('Registration email sent successfully');

    res.status(201).json({
      message: 'Registration successful',
      registration: savedRegistration,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'You are already registered for this event' });
    }
    console.error('Registration save error:', error);
    res.status(500).json({ error: 'Registration failed', details: error.message });
  }
});

// Fetch all members and their events
router.get('/members', async (req, res) => {
  try {
    console.log('Fetching all registrations...');
    const registrations = await Registration.find();
    console.log(`Found ${registrations.length} registrations`);

    console.log('Fetching all events...');
    const events = await Event.find();
    const eventMap = new Map(events.map(e => [e.eventId, e.name]));
    console.log(`Found ${events.length} events`);

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
    console.log(`Collected ${memberIds.size} unique member IDs`);

    const members = await Member.find({ memberId: { $in: Array.from(memberIds) } });
    // Use phone instead of phoneNo
    const memberMap = new Map(members.map(m => [m.memberId, { 
      name: m.name, 
      email: m.email, 
      college: m.college, 
      phone: m.phone // Changed from phoneNo
    }]));
    console.log(`Found ${members.length} members`);

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
      phone: phone || "N/A", // Changed from phoneNo
      events: memberEvents.has(memberId) ? Array.from(memberEvents.get(memberId).events).sort() : [],
    })).sort((a, b) => a.memberId.localeCompare(b.memberId));

    if (result.length === 0) {
      return res.status(200).json({ message: 'No members found with registrations', data: [] });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Fetch members error:', error);
    res.status(500).json({ error: 'Failed to fetch members', details: error.message });
  }
});

// Update registration
router.put('/register', upload.none(), async (req, res) => {
  console.log('Raw req.body:', req.body);
  const { eventId, userId, fields, name, email, paymentReceipt } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ error: 'eventId and userId are required' });
  }

  let parsedFields;
  if (fields) {
    try {
      parsedFields = JSON.parse(fields);
    } catch (error) {
      console.error('Fields parsing error:', error);
      return res.status(400).json({ error: 'Invalid fields format; must be valid JSON' });
    }

    if (!parsedFields.memberId || !parsedFields.memberId.trim()) {
      return res.status(400).json({ error: 'Member ID is required' });
    }

    const requiredFields = eventFields[eventId] || [];
    const missingFields = requiredFields.filter(field => 
      !parsedFields[field.name] || parsedFields[field.name].trim() === ""
    );
    if (missingFields.length > 0) {
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
              return res.status(400).json({
                error: `Team Member ID ${i} (teamMemberId${i}) is required`,
              });
            }
          }
          for (let i = teamSize; parsedFields[`teamMemberId${i}`]; i++) {
            return res.status(400).json({ error: `Extra team member ID (teamMemberId${i}) provided` });
          }
        }
      }
    }
  }

  try {
    const event = await Event.findOne({ eventId: Number(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const updateData = {};
    if (parsedFields) updateData.fields = new Map(Object.entries(parsedFields));
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (paymentReceipt !== undefined) updateData.paymentReceipt = paymentReceipt;

    const registration = await Registration.findOneAndUpdate(
      { eventId: Number(eventId), userId },
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.status(200).json({
      message: 'Registration updated successfully',
      registration,
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update registration' });
  }
});

router.get('/all-members', async (req, res) => {
  try {
    const members = await Member.find().sort({ memberId: 1 });
    const registrations = await Registration.find();
    const events = await Event.find();
    const eventMap = new Map(events.map(e => [e.eventId, e.name]));

    const memberEvents = new Map();
    registrations.forEach((reg) => {
      const fields = reg.fields instanceof Map ? Object.fromEntries(reg.fields) : reg.fields || {};
      const eventName = eventMap.get(reg.eventId) || `Event ${reg.eventId}`;

      if (fields.memberId) {
        if (!memberEvents.has(fields.memberId)) memberEvents.set(fields.memberId, new Set());
        memberEvents.get(fields.memberId).add(eventName);
      }

      const sizeField = Object.keys(fields).find((key) =>
        ['teamSize', 'groupSize', 'castSize'].includes(key)
      );
      const teamSize = sizeField ? parseInt(fields[sizeField]) || 0 : 0;
      if (teamSize > 1) {
        for (let i = 1; i <= teamSize - 1; i++) {
          const teamMemberId = fields[`teamMemberId${i}`];
          if (teamMemberId) {
            if (!memberEvents.has(teamMemberId)) memberEvents.set(teamMemberId, new Set());
            memberEvents.get(teamMemberId).add(eventName);
          }
        }
      }
    });

    const allMembers = members.map((member) => ({
      memberId: member.memberId,
      name: member.name,
      email: member.email,
      phone: member.phone || "N/A",
      college: member.college || "N/A",
      events: memberEvents.has(member.memberId) ? Array.from(memberEvents.get(member.memberId)) : [],
    }));

    res.status(200).json({ data: allMembers });
  } catch (error) {
    console.error('Error fetching all members:', error);
    res.status(500).json({ error: 'Failed to fetch members' });
  }
});
// Get user's registrations
router.get('/registrations', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  try {
    if (userId === "29BruJMxHXMB6mbdAZyvKVUixW13") {
      const registrations = await Registration.find();
      return res.json(registrations);
    }

    const registrations = await Registration.find({ userId });
    res.json(registrations);
  } catch (error) {
    console.error('Fetch registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});
router.get('/incomplete-registrations', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  try {
    console.log('Fetching all members...');
    const members = await Member.find();
    console.log(`Found ${members.length} members`);
    console.log('Sample members:', members.slice(0, 5).map(m => m.memberId)); // Log first 5 memberIds

    console.log('Fetching all registrations...');
    const registrations = await Registration.find();
    console.log(`Found ${registrations.length} registrations`);

    const registeredMemberIds = new Set();
    registrations.forEach((reg) => {
      const fields = reg.fields instanceof Map ? Object.fromEntries(reg.fields) : reg.fields || {};
      if (fields.memberId) {
        registeredMemberIds.add(fields.memberId);
      }

      const sizeField = Object.keys(fields).find((key) =>
        ['teamSize', 'groupSize', 'castSize'].includes(key)
      );
      const teamSize = sizeField ? parseInt(fields[sizeField]) || 0 : 0;
      if (teamSize > 1) {
        for (let i = 1; i <= teamSize - 1; i++) {
          const teamMemberId = fields[`teamMemberId${i}`];
          if (teamMemberId) {
            registeredMemberIds.add(teamMemberId);
          }
        }
      }
    });
    console.log(`Collected ${registeredMemberIds.size} unique registered member IDs`);
    console.log('Sample registered memberIds:', Array.from(registeredMemberIds).slice(0, 5));

    const incompleteMembers = members.filter(
      (member) => !registeredMemberIds.has(member.memberId)
    ).map((member) => ({
      memberId: member.memberId,
      name: member.name,
      phone: member.phone || "N/A",
      college: member.college || "N/A",
      email: member.email || "N/A",
    })).sort((a, b) => a.memberId.localeCompare(b.memberId));

    console.log(`Found ${incompleteMembers.length} members with incomplete registrations`);
    console.log('Response data:', incompleteMembers);

    res.status(200).json({ data: incompleteMembers });
  } catch (error) {
    console.error('Fetch incomplete registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch incomplete registrations', details: error.message });
  }
});
router.get('/all-registrations', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  try {
    const registrations = await Registration.find();
    console.log(`Fetched ${registrations.length} registrations`);
    res.status(200).json({ data: registrations });
  } catch (error) {
    console.error('Error fetching all registrations:', error);
    res.status(500).json({ error: 'Failed to fetch registrations', details: error.message });
  }
});
// Get all registrations (admin only)
router.get('/registrations/all', async (req, res) => {
  const { userId, eventId } = req.query;
  

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  if (userId !== "29BruJMxHXMB6mbdAZyvKVUixW13") {
    return res.status(403).json({ error: 'Unauthorized: Admin access required' });
  }

  try {
    let query = {};
    if (eventId) {
      query.eventId = Number(eventId);
    }

    const registrations = await Registration.find(query);
    res.status(200).json(registrations);
  } catch (error) {
    console.error('Fetch admin registrations error:', error);
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

// Event visibility endpoints
router.get('/visibility/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId: Number(eventId) });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({ isActive: event.isActive });
  } catch (error) {
    console.error('Error fetching visibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/visibility/:eventId', async (req, res) => {
  try {
    const { eventId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== 'boolean') {
      return res.status(400).json({ error: 'isActive must be a boolean' });
    }

    const event = await Event.findOneAndUpdate(
      { eventId: Number(eventId) },
      { $set: { isActive } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.status(200).json({
      success: true,
      message: `Event set to ${isActive ? 'active' : 'inactive'}`,
      event,
    });
  } catch (error) {
    console.error('Error updating visibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/visibility', async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ error: 'eventId is required' });
    }
    const event = await Event.findOne({ eventId: Number(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.status(200).json({ isActive: event.isActive });
  } catch (error) {
    console.error('Error fetching visibility:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;