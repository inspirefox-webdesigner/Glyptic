// new code here
const mongoose = require('mongoose');
 
const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: ''
  },
  brand: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: null
  },
  variationImages: [{
    type: String
  }],
  contents: [{
    type: {
      type: String,
      enum: ['title', 'image', 'content', 'specification', 'video', 'techSpecifications', 'manualDownload', 'table', 'coverImage', 'variationImages'],
      required: true
    },
    subType: {
      type: String,
      enum: ['text', 'image'],
      default: 'text'
    },
    videoType: {
      type: String,
      enum: ['upload', 'url'],
      default: 'upload'
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true
    },
    order: {
      type: Number,
      default: 0
    }
  }],
 
}, {
  timestamps: true
});
 
// Ensure contents is always an array
productSchema.pre('save', function(next) {
  if (!this.contents) {
    this.contents = [];
  }
  next();
});
 
module.exports = mongoose.model('Product', productSchema);






// old code here
// const mongoose = require('mongoose');

// const productSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   category: {
//     type: String,
//     required: true
//   },
//   contents: [{
//     type: {
//       type: String,
//       enum: ['title', 'image', 'content', 'specification', 'video', 'techSpecifications', 'manualDownload', 'table'],
//       required: true
//     },
//     subType: {
//       type: String,
//       enum: ['text', 'image'],
//       default: 'text'
//     },
//     data: {
//       type: mongoose.Schema.Types.Mixed,
//       required: true
//     },
//     order: {
//       type: Number,
//       default: 0
//     }
//   }],

// }, {
//   timestamps: true
// });

// // Ensure contents is always an array
// productSchema.pre('save', function(next) {
//   if (!this.contents) {
//     this.contents = [];
//   }
//   next();
// });

// module.exports = mongoose.model('Product', productSchema);