const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const registrationRoutes = require('../routes/registrationRoutes');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
const app = express();
app.use(express.json());
app.use(cors());

app.use(cors({
  origin: [process.env.ALLOWED_ROUTE_2, process.env.ALLOWED_ROUTE_1],
  methods: ['GET', 'POST', 'PUT'],
  allowedHeaders: ['Content-Type'],
}));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});



// Connect to MongoDB
const mongoUri = process.env.MONGO_URL || process.env.MONGO_URI || "mongodb+srv://yatin2104:yatin2104@bvicam-nsc.z71wy.mongodb.net/";
if (!mongoUri) {
  console.error('MongoDB connection skipped: set MONGO_URL or MONGO_URI in backend/.env');
} else {
  mongoose.connect(mongoUri, {
  }).then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
}

// Mount routes
const memberRoutes = require("../routes/memberRoutes");
app.use("/api", memberRoutes);
app.use('/api', registrationRoutes);

// const PORT = process.env.PORT || 5001;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
