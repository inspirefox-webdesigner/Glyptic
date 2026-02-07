const express = require('express');
const router = express.Router();
const { getHomePage, updateHomePage, uploadHomeImage, upload } = require('../controllers/homePageController');

// GET /api/home-page - Get home page content
router.get('/', getHomePage);

// PUT /api/home-page - Update home page content
router.put('/', updateHomePage);

// POST /api/home-page/upload - Upload image for home page
router.post('/upload', upload.single('image'), uploadHomeImage);

module.exports = router;