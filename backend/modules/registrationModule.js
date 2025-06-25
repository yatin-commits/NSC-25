  
const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  eventId: { type: Number, required: true },
  userId: { type: String, required: true },
  name: { type: String, required: true },
  email: { type: String, required: true, match: [/.+\@.+\..+/, 'Please enter a valid email address'] },
  fields: {
    type: Map,
    of: String,
    required: true,
    validate: {
      validator: function (fields) {
        if (!fields.has('memberId') || !fields.get('memberId').trim()) return false;
        const sizeFields = ['teamSize', 'groupSize', 'castSize'];
        const sizeField = sizeFields.find((field) => fields.has(field));
        if (sizeField) {
          const teamSize = parseInt(fields.get(sizeField)) || 0;
          if (teamSize > 1) {
            for (let i = 1; i <= teamSize - 1; i++) {
              if (!fields.get(`teamMemberId${i}`) || !fields.get(`teamMemberId${i}`).trim()) return false;
            }
            for (let i = teamSize; fields.has(`teamMemberId${i}`); i++) return false;
          }
        }
        return true;
      },
      message: 'Fields must include a valid memberId and correct number of teamMemberId fields matching the specified size.',
    },
  },
  paymentReceipt: { type: String, default: null }, 
  registeredAt: { type: Date, default: Date.now },
});

registrationSchema.index({ userId: 1, eventId: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);