const express = require('express');
const router = express.Router();
const emailService = require('../utils/emailService');
 
// Send email notification
router.post('/email', async (req, res) => {
  try {
    const { to, formType, formData } = req.body;
 
    if (!formType || !formData) {
      return res.status(400).json({ message: 'Form type and data are required' });
    }
 
    let emailSent = false;
 
    switch (formType) {
      case 'contact':
        await emailService.sendContactNotification(formData);
        emailSent = true;
        break;
     
      case 'career':
        await emailService.sendCareerNotification(formData);
        emailSent = true;
        break;
     
      case 'training':
        await emailService.sendTrainingNotification(formData, to);
        emailSent = true;
        break;
     
      default:
        return res.status(400).json({ message: 'Invalid form type' });
    }
 
    if (emailSent) {
      res.json({ message: 'Email notification sent successfully' });
    } else {
      res.status(500).json({ message: 'Failed to send email notification' });
    }
  } catch (error) {
    console.error('Email notification error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
 
module.exports = router;