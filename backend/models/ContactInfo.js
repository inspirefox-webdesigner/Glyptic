const mongoose = require('mongoose');

const contactInfoSchema = new mongoose.Schema({
  emailAddress: {
    title: { type: String, default: 'Email address' },
    emails: [{ type: String }]
  },
  phoneNumber: {
    title: { type: String, default: 'Phone number' },
    phones: [{ type: String }]
  },
  location: {
    title: { type: String, default: 'Our Location' },
    address: { type: String }
  },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('ContactInfo', contactInfoSchema);