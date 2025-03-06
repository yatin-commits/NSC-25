const mongoose = require('mongoose');

const registrationSchema= new mongoose.Schema({
    eventId:{
        type:Number,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    fields: { 
        type: Map, 
        of: String,
        required: true 
    }, // Dynamic fields
  registeredAt: { 
    type: Date, 
    default: Date.now },
})
const Registration = mongoose.model("Registration", registrationSchema);
module.exports = Registration; // ✅ Ensure it's exported