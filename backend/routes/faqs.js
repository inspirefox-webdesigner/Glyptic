const express = require('express');
const router = express.Router();
const {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
} = require('../controllers/faqController');

router.get('/', getAllFAQs);
router.get('/:id', getFAQById);
router.post('/', createFAQ);
router.put('/:id', updateFAQ);
router.delete('/:id', deleteFAQ);

module.exports = router;