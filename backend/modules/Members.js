const mongoose = require("mongoose");

const memberSchema = new mongoose.Schema({
  memberId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  email: { type: String, required: true }, // Removed unique: true
  phone: { type: String, required: true, unique: true }, // Kept unique
  college: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Member", memberSchema);












const eventSchema = new mongoose.Schema({
  eventId: { 
    type: Number, 
    required: true, 
    unique: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  image: { 
    type: String, // URL or path to event image
    required: true 
  },
  shortDescription: { 
    type: String, 
    required: true 
  },
  longDescription: { 
    type: String, 
    required: true 
  },
  time: { 
    type: String, 
    required: true 
  },
  venue: { 
    type: String, 
    required: true 
  },
  dates: [{ 
    type: String, // Format: "YYYY-MM-DD"
    required: true 
  }],
  rules: [{ 
    type: String,
    required: true 
  }],
  prize: { 
    type: String, 
    default: "TBD" 
  },
  contact: [{ 
    type: String, // Format: "Name: Phone"
    required: true 
  }],
  isRegistrationOver: { 
    type: Boolean, 
    default: false 
  },
  requiresPayment: { 
    type: Boolean, 
    default: false 
  },
  registrationFee: { 
    type: Number, 
    required: function() { 
      return this.requiresPayment; 
    } 
  },
  qrCode: { 
    type: String, // URL or path to QR code image
    required: function() { 
      return this.requiresPayment; 
    } 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for efficient queries
eventSchema.index({ eventId: 1 }, { unique: true });
eventSchema.index({ isRegistrationOver: 1 });
eventSchema.index({ requiresPayment: 1 });
