const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const {
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide
} = require('../controllers/heroSliderController');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Routes
router.get('/', getHeroSlides);
router.get('/:id', getHeroSlide);
router.post('/', upload.single('image'), createHeroSlide);
router.put('/:id', upload.single('image'), updateHeroSlide);
router.delete('/:id', deleteHeroSlide);

module.exports = router;