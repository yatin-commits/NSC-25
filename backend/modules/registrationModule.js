const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    match: [/.+\@.+\..+/, 'Please enter a valid email address'], // Basic email validation
  },
  fields: {
    type: Map,
    of: String,
    required: true,
    validate: {
      validator: function (fields) {
        // Ensure memberId is present
        if (!fields.has('memberId') || !fields.get('memberId').trim()) {
          return false;
        }

        // Check team-based fields if a size field exists
        const sizeFields = ['teamSize', 'groupSize', 'castSize'];
        const sizeField = sizeFields.find((field) => fields.has(field));
        if (sizeField) {
          const teamSize = parseInt(fields.get(sizeField)) || 0;
          if (teamSize > 1) { // Team-based event (excluding the user)
            for (let i = 1; i <= teamSize - 1; i++) {
              const teamMemberId = fields.get(`teamMemberId${i}`);
              if (!teamMemberId || !teamMemberId.trim()) {
                return false; // Missing or empty team member ID
              }
            }
            // Ensure no extra team member IDs
            for (let i = teamSize; fields.has(`teamMemberId${i}`); i++) {
              return false; // Extra team member IDs found
            }
          }
        }
        return true;
      },
      message: 'Fields must include a valid memberId and correct number of teamMemberId fields matching the specified size.',
    },
  },
  registeredAt: {
    type: Date,
    default: Date.now,
  },
});

// Add compound index to prevent duplicate registrations
registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

const Registration = mongoose.model('Registration', registrationSchema);
module.exports = Registration;