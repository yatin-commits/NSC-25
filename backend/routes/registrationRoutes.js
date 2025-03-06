const express = require('express');
const router = express.Router();
const Registration = require('../modules/registrationModule');
const { log } = require('console');

// Event-specific required fields
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



// Register for an event
router.post('/register', async (req, res) => {
  console.log(typeof Registration, Registration);
  const { eventId, userId, fields } = req.body;
  console.log(req.body);
  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  const requiredFields = eventFields[eventId];
  if (!requiredFields.every(field => fields[field])) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    console.log("hi");
    
    const registration = new Registration({ eventId, userId, fields });
    console.log(registration);
    
    await registration.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Get user's registrations
router.get('/registrations', async (req, res) => {
  const { userId } = req.query; // Use query param for GET

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  try {
    const registrations = await Registration.find({ userId });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});

module.exports = router;