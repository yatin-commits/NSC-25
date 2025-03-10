const mongoose = require('mongoose');
const Event = require('./modules/evetModules'); // Import the Event model

// MongoDB connection string (replace with your MongoDB URI)
const mongoURI = 'mongodb+srv://yatin2104:yatin2104@bvicam-nsc.z71wy.mongodb.net/users';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB Connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

// Original events data array
const eventsData = [
  {
    id: 1,
    name: "Code Avengers",
  },
  {
    id: 2,
    name: "Bollywood Bazigar",
  },
  {
    id: 3,
    name: "Volleyball",
  },
  {
    id: 4,
    name: "Battle Byte",
  },
  {
    id: 5,
    name: "Shark Tank",
  },
  {
    id: 6,
    name: "Candid Moments",
  },
  {
    id: 7,
    name: "Cine Blitz",
  },
  {
    id: 8,
    name: "Rangmanch",
  },
  {
    id: 9,
    name: "Fandango",
  },
  {
    id: 10,
    name: "War of Words",
  },
  {
    id: 11,
    name: "Bollywood Beats",
  },
  {
    id: 12,
    name: "Creative Canvas",
  },
];

// Function to insert filtered events into MongoDB
const insertEvents = async () => {
  try {
    const filteredEvents = eventsData.map(event => ({
      eventId: event.id,
      name: event.name,
      isActive: true, // Default value
    }));

    const insertedEvents = await Event.insertMany(filteredEvents);
    console.log('Events inserted successfully:', insertedEvents);
  } catch (error) {
    console.error('Error inserting events:', error);
  } finally {
    mongoose.connection.close(); // Close the database connection
  }
};

// Call the function
insertEvents();
