const mongoose = require('mongoose');

const trainingEventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  time: {
    type: String,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  formType: {
    type: String,
    enum: ['existing', 'custom'],
    default: 'existing'
  },
  customFormLink: {
    type: String,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('TrainingEvent', trainingEventSchema);