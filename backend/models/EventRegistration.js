const mongoose = require('mongoose');
 
const eventRegistrationSchema = new mongoose.Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TrainingEvent',
    required: true
  },
  eventTitle: {
    type: String,
    required: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  registeredAt: {
    type: Date,
    default: Date.now
  }
});
 
// Create compound index to prevent duplicate registrations
eventRegistrationSchema.index({ eventId: 1, email: 1 }, { unique: true });
 
module.exports = mongoose.model('EventRegistration', eventRegistrationSchema);