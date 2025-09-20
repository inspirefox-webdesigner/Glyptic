const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    default: 'glyptic@gmail.com'
  },
  password: {
    type: String,
    required: true,
    default: '12345678'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Admin', adminSchema);