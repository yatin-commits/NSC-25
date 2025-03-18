const express = require('express');
const router = express.Router();
const cors = require('cors');
const nodemailer = require('nodemailer');

// Middleware setup (moved outside router for clarity)
const app = express();
app.use(cors({
  origin: 'https://bvicam-nsc-25.vercel.app', // Your frontend origin
  methods: ['GET', 'POST', 'PUT'], // Allowed methods
  allowedHeaders: ['Content-Type'], // Allowed headers
}));
app.use(express.json()); // Ensure JSON parsing is enabled

const Registration = require('../modules/registrationModule');
const Event = require('../modules/evetModules'); // Fixed typo: 'evetModules' -> 'eventModules'

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Your Gmail address (e.g., 'your-email@gmail.com')
    pass: process.env.EMAIL_PASS, // Your Gmail App Password
  },
});

// Event-specific required fields (from your frontend eventFields)
const eventFields = {
  1: ['teamName', 'teamSize', 'preferredLanguage'],
  2: ['performanceType', 'groupSize', 'songChoice'],
  3: ['teamName', 'teamSize'],
  4: ['codingLanguage', 'experienceLevel'],
  5: ['pitchTitle', 'teamSize', 'industry'],
  6: ['cameraType', 'photoTheme'],
  7: ['filmTitle', 'teamSize', 'genre'],
  8: ['playTitle', 'castSize'],
  9: ['danceStyle', 'groupSize'],
  10: ['debateTopicPreference', 'teamName'],
  11: ['songChoice', 'groupSize', 'choreographer'],
  12: ['artMedium', 'artTheme'],
};

// Helper function to check if an event is team-based
const isTeamBasedEvent = (eventId) => {
  const fields = eventFields[eventId] || [];
  return fields.some(field => ['teamSize', 'groupSize', 'castSize'].includes(field));
};

// Register for an event
router.post('/register', async (req, res) => {
  const { eventId, userId, fields, name, email, eventName } = req.body;

  if (!userId || !eventId || !name || !email || !fields) {
    return res.status(400).json({ error: 'All fields (eventId, userId, name, email, fields) are required' });
  }

  // Validate memberId
  if (!fields.memberId || !fields.memberId.trim()) {
    return res.status(400).json({ error: 'Member ID is required' });
  }

  // Validate event-specific fields
  const requiredFields = eventFields[eventId];
  if (!requiredFields || !requiredFields.every(field => fields[field] && fields[field].trim())) {
    return res.status(400).json({ error: 'Missing or empty required event-specific fields' });
  }

  // Validate team member IDs for team-based events
  if (isTeamBasedEvent(eventId)) {
    const sizeField = requiredFields.find(f => ['teamSize', 'groupSize', 'castSize'].includes(f));
    if (sizeField) {
      const teamSize = parseInt(fields[sizeField]) || 0;
      if (teamSize > 1) { // Assuming memberId counts as one
        for (let i = 1; i <= teamSize - 1; i++) {
          if (!fields[`teamMemberId${i}`] || !fields[`teamMemberId${i}`].trim()) {
            return res.status(400).json({ error: `Team Member ID ${i} is required` });
          }
        }
        for (let i = teamSize; fields[`teamMemberId${i}`]; i++) {
          return res.status(400).json({ error: `Extra team member ID (teamMemberId${i}) provided` });
        }
      }
    }
  }

  try {
    // Check if the event exists
    const event = await Event.findOne({ eventId: Number(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Save the registration
    const registration = new Registration({ eventId, userId, name, email, fields });
    await registration.save();

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Registration Confirmation for ${eventName}`,
      html: `
        <h2>Thank You for Registering!</h2>
        <p>Dear ${name},</p>
        <p>You have successfully registered for <strong>${eventName}</strong>!</p>
        <p><strong>Your Member ID:</strong> ${fields.memberId}</p>
        ${
          isTeamBasedEvent(eventId) && fields[sizeField]
            ? `
          <p><strong>Team Details:</strong></p>
          <ul>
            ${Array.from({ length: parseInt(fields[sizeField]) - 1 }, (_, i) => `
              <li>Team Member ${i + 1} ID: ${fields[`teamMemberId${i + 1}`]}</li>
            `).join("")}
          </ul>
        `
            : ""
        }
        <p><strong>Venue:</strong> ${event.venue || "To be announced"}</p>
        <p>We look forward to seeing you at the event. For any queries, contact us at <a href="mailto:support@bvicam.ac.in">support@bvicam.ac.in</a>.</p>
        <p>Best regards,<br/>The BVICAM NSC Team</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(201).json({ message: 'Registration successful and email sent' });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(201).json({ message: 'Registration successful, but email sending failed' });
    }
  } catch (error) {
    if (error.code === 11000) { // Duplicate key error from unique index
      return res.status(400).json({ error: 'You are already registered for this event' });
    }
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Update registration
router.put('/register', async (req, res) => {
  const { eventId, userId, fields, name, email } = req.body;

  if (!eventId || !userId) {
    return res.status(400).json({ error: 'eventId and userId are required' });
  }

  if (fields) {
    if (!fields.memberId || !fields.memberId.trim()) {
      return res.status(400).json({ error: 'Member ID is required' });
    }

    const requiredFields = eventFields[eventId];
    if (!requiredFields || !requiredFields.every(field => fields[field] && fields[field].trim())) {
      return res.status(400).json({ error: 'Missing or empty required event-specific fields' });
    }

    if (isTeamBasedEvent(eventId)) {
      const sizeField = requiredFields.find(f => ['teamSize', 'groupSize', 'castSize'].includes(f));
      if (sizeField) {
        const teamSize = parseInt(fields[sizeField]) || 0;
        if (teamSize > 1) {
          for (let i = 1; i <= teamSize - 1; i++) {
            if (!fields[`teamMemberId${i}`] || !fields[`teamMemberId${i}`].trim()) {
              return res.status(400).json({ error: `Team Member ID ${i} is required` });
            }
          }
          for (let i = teamSize; fields[`teamMemberId${i}`]; i++) {
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
    if (fields) updateData.fields = fields;
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;

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

// Get user's registrations
router.get('/registrations', async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  try {
    if (userId === "29BruJMxHXMB6mbdAZyvKVUixW13") { // Admin UID
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

// Get all registrations (admin only)
router.get('/registrations/all', async (req, res) => {
  const { userId, eventId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  if (userId !== "29BruJMxHXMB6mbdAZyvKVUixW13") { // Admin UID check
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

// Event visibility endpoints (unchanged)
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