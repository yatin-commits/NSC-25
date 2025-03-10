// modules/eventModule.js
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;