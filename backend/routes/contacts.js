const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const emailService = require('../utils/emailService');

// Get all contact submissions
router.get('/', async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new contact submission
router.post('/', async (req, res) => {
  try {
    const contact = new Contact(req.body);
    const savedContact = await contact.save();
    
    // Send email notification
    await emailService.sendContactNotification(savedContact);
    
    res.status(201).json(savedContact);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete contact submission
router.delete('/:id', async (req, res) => {
  try {
    await Contact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact submission deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;