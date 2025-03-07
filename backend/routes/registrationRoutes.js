const express = require('express');
const router = express.Router();
const app = express();
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
  const { userId } = req.query;

  if (!userId) {
    return res.status(401).json({ error: 'User ID required' });
  }

  try {
    // Check if the user is an admin
    if (userId === "29BruJMxHXMB6mbdAZyvKVUixW13") { // Replace with actual admin UID
      const registrations = await Registration.find(); // Fetch all registrations
      return res.json(registrations);
    }

    // Normal users get only their own registrations
    const registrations = await Registration.find({ userId });
    res.json(registrations);

  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch registrations' });
  }
});


// Sample in-memory registrations data
// const registrations = [
//   {
//     userId: "uid1",
//     email: "user1@example.com",
//     displayName: "User One",
//     eventId: 1,
//     eventName: "Code Avengers",
//     fields: { teamName: "Team A", phone: "1234567890" },
//   },
//   {
//     userId: "uid2",
//     email: "user2@example.com",
//     displayName: "User Two",
//     eventId: 2,
//     eventName: "Bollywood Bazigar",
//     fields: { teamName: "Team B", phone: "0987654321" },
//   },
//   // Add more registrations as needed
// ];

// // New route to fetch registrations, optionally filtered by eventId
// router.get("/api/registrations", (req, res) => {
//   const eventId = req.query.eventId ? parseInt(req.query.eventId) : null;
//   let filteredRegistrations = registrations;
//   if (eventId) {
//     filteredRegistrations = registrations.filter(reg => reg.eventId === eventId);
//   }
//   res.json(filteredRegistrations);
// });

// Optional: Keep the old route if needed elsewhere
router.get("/registrations/all", async (req, res) => {
  try {
    const { eventId } = req.query;
    if (!eventId) {
      return res.status(400).json({ message: "Event ID is required" });
    }

    // Exclude userId using .select('-userId')
    const registrations = await Registration.find({ eventId: eventId }).select("-userId");

    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});




module.exports = router;