const mongoose = require('mongoose');

const careerSchema = new mongoose.Schema({
  honorific: { type: String, required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  qualification: { type: String, required: true },
  specialization: { type: String, required: true },
  position: { type: String, required: true },
  experience: { type: String, required: true },
  postalAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Career', careerSchema);