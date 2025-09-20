const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  contents: [{
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
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Blog', blogSchema);