const express = require('express');
const router = express.Router();
const Career = require('../models/Career');
const emailService = require('../utils/emailService');

// Get all career applications
router.get('/', async (req, res) => {
  try {
    const careers = await Career.find().sort({ createdAt: -1 });
    res.json(careers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new career application
router.post('/', async (req, res) => {
  try {
    const career = new Career(req.body);
    const savedCareer = await career.save();
    
    // Send email notification
    await emailService.sendCareerNotification(savedCareer);
    
    res.status(201).json(savedCareer);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete career application
router.delete('/:id', async (req, res) => {
  try {
    await Career.findByIdAndDelete(req.params.id);
    res.json({ message: 'Career application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;