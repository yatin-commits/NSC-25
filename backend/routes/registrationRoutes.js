const express = require('express');
const router = express.Router();
const cors = require('cors');

// Apply middleware directly to router for Vercel compatibility
router.use(cors({
  origin: 'https://bvicam-nsc-25.vercel.app',
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));
router.use(express.json());

const Registration = require('../modules/registrationModule');
const Event = require('../modules/evetModules'); // Fixed typo

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

const isTeamBasedEvent = (eventId) => {
  const fields = eventFields[eventId] || [];
  return fields.some(field => ['teamSize', 'groupSize', 'castSize'].includes(field));
};

// Register for an event
router.post('/register', async (req, res) => {
  const { eventId, userId, fields, name, email } = req.body;

  if (!userId || !eventId || !name || !email || !fields) {
    return res.status(400).json({ error: 'All fields (eventId, userId, name, email, fields) are required' });
  }

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

  try {
    const event = await Event.findOne({ eventId: Number(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const registration = new Registration({ eventId, userId, name, email, fields });
    await registration.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    if (error.code === 11000) {
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