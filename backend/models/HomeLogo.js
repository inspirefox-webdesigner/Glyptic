const mongoose = require('mongoose');

const homeLogoSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['brand', 'category'],
    required: true
  },
  value: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('HomeLogo', homeLogoSchema);
