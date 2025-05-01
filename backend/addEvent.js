const mongoose = require('mongoose');
const Event = require('./modules/evetModules');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' }); // Adjust the path to your .env file
 // Import the Event model

// MongoDB connection string (replace with your MongoDB URI)
const mongoURI = process.env.MONGO_UR || ; // Replace with your MongoDB URI

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
    name: "Battle Bytes",
  },
  {
    id: 2,
    name: "Shark Tank",
  },
  {
    id: 3,
    name: "Rangmanch",
  },
  {
    id: 4,
    name: "Basketball",
  },
  {
    id: 5,
    name: "War of Words",
  },
  {
    id: 6,
    name: "Fandango",
  },
  {
    id: 7,
    name: "Creative Canvas",
  },
  {
    id: 8,
    name: "Candid Moments",
  },
  {
    id: 9,
    name: "Code Avengers",
  },
  {
    id: 10,
    name: "Volleyball",
  },
  {
    id: 11,
    name: "Cine Blitz",
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
