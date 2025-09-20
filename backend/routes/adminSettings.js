const express = require('express');
const router = express.Router();
const AdminSettings = require('../models/AdminSettings');

// Get admin settings
router.get('/', async (req, res) => {
  try {
    let settings = await AdminSettings.findOne();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = new AdminSettings({
        emailSettings: {
          adminEmail: 'webdesigner2502@gmail.com',
          emailEnabled: true
        },
        passwordSettings: {
          currentPassword: 'admin123'
        }
      });
      await settings.save();
    }
    
    res.json(settings);
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    res.status(500).json({ message: 'Error fetching admin settings' });
  }
});

// Update admin settings
router.put('/', async (req, res) => {
  try {
    const { emailSettings, passwordSettings } = req.body;
    
    let settings = await AdminSettings.findOne();
    
    if (!settings) {
      settings = new AdminSettings();
    }
    
    if (emailSettings) {
      settings.emailSettings = {
        ...settings.emailSettings,
        ...emailSettings
      };
    }
    
    if (passwordSettings) {
      settings.passwordSettings = {
        ...settings.passwordSettings,
        ...passwordSettings
      };
    }
    
    settings.lastUpdated = new Date();
    await settings.save();
    
    res.json({ message: 'Settings updated successfully', settings });
  } catch (error) {
    console.error('Error updating admin settings:', error);
    res.status(500).json({ message: 'Error updating admin settings' });
  }
});

module.exports = router;