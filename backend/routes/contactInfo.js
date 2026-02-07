const express = require('express');
const router = express.Router();
const { getContactInfo, updateContactInfo } = require('../controllers/contactInfoController');

// GET /api/contact-info - Get contact information
router.get('/', getContactInfo);

// PUT /api/contact-info - Update contact information
router.put('/', updateContactInfo);

module.exports = router;