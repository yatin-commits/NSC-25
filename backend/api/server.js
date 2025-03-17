const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const registrationRoutes = require('../routes/registrationRoutes');
// require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cors({
  origin: ['https://bvicam-nsc-25.vercel.app','http://localhost:5173'], 
  methods: ['GET', 'POST', 'PUT'], 
  allowedHeaders: ['Content-Type'], 
}));

app.get('/', (req, res) => {
  res.send('Hello from Express!');
});

// Connect to MongoDB
mongoose.connect("mongodb+srv://yatin2104:yatin2104@bvicam-nsc.z71wy.mongodb.net/users", {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mount routes
app.use('/api', registrationRoutes);
const memberRoutes = require("../routes/memberRoutes");
app.use("/api", memberRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));