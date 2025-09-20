const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  answer: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  }
});

const faqSchema = new mongoose.Schema({
  categoryName: {
    type: String,
    required: true
  },
  questions: [questionSchema]
}, {
  timestamps: true
});

module.exports = mongoose.model('FAQ', faqSchema);