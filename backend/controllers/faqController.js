const FAQ = require('../models/FAQ');

// Get all FAQs
const getAllFAQs = async (req, res) => {
  try {
    const faqs = await FAQ.find().sort({ createdAt: -1 });
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get FAQ by ID
const getFAQById = async (req, res) => {
  try {
    const faq = await FAQ.findById(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new FAQ
const createFAQ = async (req, res) => {
  try {
    const { categoryName, questions } = req.body;
    
    // Check if category already exists
    const existingFAQ = await FAQ.findOne({ categoryName });
    
    if (existingFAQ) {
      // Add questions to existing category
      const newQuestions = questions.map(q => ({
        ...q,
        order: existingFAQ.questions.length + q.order
      }));
      
      existingFAQ.questions.push(...newQuestions);
      const savedFAQ = await existingFAQ.save();
      res.status(200).json(savedFAQ);
    } else {
      // Create new category
      const faq = new FAQ(req.body);
      const savedFAQ = await faq.save();
      res.status(201).json(savedFAQ);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update FAQ
const updateFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json(faq);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete FAQ
const deleteFAQ = async (req, res) => {
  try {
    const faq = await FAQ.findByIdAndDelete(req.params.id);
    if (!faq) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllFAQs,
  getFAQById,
  createFAQ,
  updateFAQ,
  deleteFAQ
};