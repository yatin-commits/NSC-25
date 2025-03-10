const express = require('express');
const router = express.Router();
const app = express();
const Registration = require('../modules/registrationModule');
const Event = require('../modules/evetModules')
const { log } = require('console');
app.use(cors({
  origin: 'https://bvicam-nsc-25.vercel.app', // Allow your frontend origin
  methods: ['GET', 'POST', 'PUT'], // Allow specific methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));
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
  const { eventId, userId, fields,name , email } = req.body;
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
    
    const registration = new Registration({ eventId, userId,name,email,fields });
    console.log("registartions:",registration);
    
    await registration.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

router.put('/register', async (req, res) => {
  const { eventId, userId, fields, name, email } = req.body;

  // Validate required inputs
  if (!eventId || !userId) {
    return res.status(400).json({ error: 'eventId and userId are required' });
  }

  // Check if fields are provided and valid
  if (fields) {
    const requiredFields = eventFields[eventId];
    if (!requiredFields || !requiredFields.every(field => fields[field])) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
  }

  try {
    // Check if the event exists and is active (optional restriction)
    const event = await Event.findOne({ eventId: Number(eventId) });
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    // Uncomment the line below if you want to restrict updates to active events only
    // if (!event.isActive) {
    //   return res.status(403).json({ error: 'Event is inactive, updates not allowed' });
    // }

    // Find and update the registration
    const updateData = {};
    if (fields) updateData.fields = fields;
    if (name !== undefined) updateData.name = name; // Allow name to be updated if provided
    if (email !== undefined) updateData.email = email; // Allow email to be updated if provided

    const registration = await Registration.findOneAndUpdate(
      { eventId: Number(eventId), userId },
      { $set: updateData },
      { new: true } // Return the updated document
    );

    if (!registration) {
      return res.status(404).json({ error: 'Registration not found' });
    }

    res.status(200).json({
      message: 'Registration updated successfully',
      registration
    });
  } catch (error) {
    console.error("Error updating registration:", error);
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


router.get("/visibility/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findOne({ eventId: Number(eventId) });

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({ isActive: event.isActive });
  } catch (error) {
    console.error("Error fetching visibility:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.put("/visibility/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;
    const { isActive } = req.body;

    if (typeof isActive !== "boolean") {
      return res.status(400).json({ error: "isActive must be a boolean" });
    }

    const event = await Event.findOneAndUpdate(
      { eventId: Number(eventId) },
      { $set: { isActive } },
      { new: true }
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    res.status(200).json({
      success: true,
      message: `Event set to ${isActive ? "active" : "inactive"}`,
      event,
    });
  } catch (error) {
    console.error("Error updating visibility:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});









module.exports = router;