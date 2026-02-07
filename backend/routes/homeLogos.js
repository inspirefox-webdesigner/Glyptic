const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const HomeLogo = require('../models/HomeLogo');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/home-logos';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
});

// Get all logos
router.get('/', async (req, res) => {
  try {
    const logos = await HomeLogo.find().sort({ createdAt: -1 });
    res.json(logos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add new logo
router.post('/', upload.single('image'), async (req, res) => {
  try {
    const { type, value } = req.body;
    
    if (!req.file) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const logo = new HomeLogo({
      imageUrl: `/uploads/home-logos/${req.file.filename}`,
      type,
      value
    });

    await logo.save();
    res.status(201).json(logo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update logo
router.put('/:id', upload.single('image'), async (req, res) => {
  try {
    const { type, value } = req.body;
    const logo = await HomeLogo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '..', logo.imageUrl);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      logo.imageUrl = `/uploads/home-logos/${req.file.filename}`;
    }

    logo.type = type;
    logo.value = value;

    await logo.save();
    res.json(logo);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete logo
router.delete('/:id', async (req, res) => {
  try {
    const logo = await HomeLogo.findById(req.params.id);

    if (!logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '..', logo.imageUrl);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await HomeLogo.findByIdAndDelete(req.params.id);
    res.json({ message: 'Logo deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
