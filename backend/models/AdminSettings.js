const mongoose = require('mongoose');

const adminSettingsSchema = new mongoose.Schema({
  emailSettings: {
    adminEmail: {
      type: String,
      required: true,
      default: 'webdesigner2502@gmail.com'
    },
    emailEnabled: {
      type: Boolean,
      default: true
    }
  },
  passwordSettings: {
    currentPassword: {
      type: String,
      default: 'admin123'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AdminSettings', adminSettingsSchema);