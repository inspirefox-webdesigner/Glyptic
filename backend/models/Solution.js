const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['title', 'image', 'content'],
    required: true
  },
  data: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    required: true
  }
});

const solutionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  contents: [contentSchema],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Solution', solutionSchema);