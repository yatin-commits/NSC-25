const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const registrationRoutes = require('../routes/registrationRoutes');
const dotenv = require('dotenv');
dotenv.config({ path: '../.env' }); 
dotenv.config(); 
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
mongoose.connect(process.env.MONGO_URL, {
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mount routes
const memberRoutes = require("../routes/memberRoutes");
app.use("/api", memberRoutes);
app.use('/api', registrationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));