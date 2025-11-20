const HeroSlider = require('../models/HeroSlider');
const path = require('path');
const fs = require('fs');

// Get all hero slides
const getHeroSlides = async (req, res) => {
  try {
    const slides = await HeroSlider.find().sort({ createdAt: 1 });
    res.json(slides);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single hero slide
const getHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlider.findById(req.params.id);
    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }
    res.json(slide);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new hero slide
const createHeroSlide = async (req, res) => {
  try {
    const { title } = req.body;
    const image = req.file ? req.file.filename : null;

    if (!image) {
      return res.status(400).json({ message: 'Image is required' });
    }

    const slide = new HeroSlider({
      title,
      image
    });

    const savedSlide = await slide.save();
    res.status(201).json(savedSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update hero slide
const updateHeroSlide = async (req, res) => {
  try {
    const { title, isActive } = req.body;
    const slide = await HeroSlider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    // Update fields
    slide.title = title || slide.title;
    slide.isActive = isActive !== undefined ? isActive : slide.isActive;

    // Update image if new one is uploaded
    if (req.file) {
      // Delete old image
      const oldImagePath = path.join(__dirname, '../uploads', slide.image);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
      slide.image = req.file.filename;
    }

    const updatedSlide = await slide.save();
    res.json(updatedSlide);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete hero slide
const deleteHeroSlide = async (req, res) => {
  try {
    const slide = await HeroSlider.findById(req.params.id);

    if (!slide) {
      return res.status(404).json({ message: 'Slide not found' });
    }

    // Delete image file
    const imagePath = path.join(__dirname, '../uploads', slide.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await HeroSlider.findByIdAndDelete(req.params.id);
    res.json({ message: 'Slide deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHeroSlides,
  getHeroSlide,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide
};