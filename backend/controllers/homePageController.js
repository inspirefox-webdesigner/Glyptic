const HomePage = require('../models/HomePage');
const multer = require('multer');
const path = require('path');

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  fileFilter: function (req, file, cb) {
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

// Get home page content
const getHomePage = async (req, res) => {
  try {
    let homePage = await HomePage.findOne();
    
    // If no home page content exists, create default one
    if (!homePage) {
      homePage = new HomePage({
        whoWeAre: {
          image: 'assets/img/normal/about_1-1.jpg',
          mainHeading: 'Who We Are?',
          tagline: 'Empowering Integrators, Safeguarding Industries',
          description: 'We are a leading provider of fire safety solutions with years of experience in the industry. Our commitment to excellence and innovation has made us a trusted partner for businesses worldwide.',
          partnerText: 'Glyptic: Partnering with pros to protect what matters most!',
          certifiedText: 'Certified & Awards winner',
          qualityText: 'Best Quality Services'
        }
      });
      await homePage.save();
    }
    
    res.json(homePage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update home page content
const updateHomePage = async (req, res) => {
  try {
    const { whoWeAre } = req.body;
    
    let homePage = await HomePage.findOne();
    
    if (!homePage) {
      homePage = new HomePage();
    }
    
    if (whoWeAre) {
      homePage.whoWeAre = { ...homePage.whoWeAre, ...whoWeAre };
    }
    
    homePage.updatedAt = new Date();
    await homePage.save();
    
    res.json(homePage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Upload image for home page
const uploadHomeImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    const imageUrl = req.file.filename;
    res.json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getHomePage,
  updateHomePage,
  uploadHomeImage,
  upload
};