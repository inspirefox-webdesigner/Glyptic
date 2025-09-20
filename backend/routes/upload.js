const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Upload endpoint - handles both 'file' and 'image' field names
router.post('/upload', (req, res) => {
  // Try 'file' first, then 'image'
  const uploadFile = upload.single('file');
  const uploadImage = upload.single('image');
  
  uploadFile(req, res, (err) => {
    if (err || !req.file) {
      // Try with 'image' field name
      uploadImage(req, res, (err2) => {
        if (err2) {
          console.error('Upload error:', err2);
          return res.status(500).json({ error: 'Upload failed', message: err2.message });
        }
        
        if (!req.file) {
          return res.status(400).json({ error: 'No file uploaded' });
        }

        console.log('File uploaded successfully:', req.file.filename);
        res.json({
          success: true,
          filename: req.file.filename,
          originalName: req.file.originalname,
          size: req.file.size
        });
      });
    } else {
      console.log('File uploaded successfully:', req.file.filename);
      res.json({
        success: true,
        filename: req.file.filename,
        originalName: req.file.originalname,
        size: req.file.size
      });
    }
  });
});

// Alternative upload endpoint specifically for images
router.post('/upload-image', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No image uploaded' });
  }

  console.log('Image uploaded successfully:', req.file.filename);
  res.json({
    success: true,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size
  });
});

// Download endpoint for PDFs with proper headers
router.get('/download/:filename', (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(uploadsDir, filename);
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'File not found' });
  }
  
  // Get file stats
  const stat = fs.statSync(filePath);
  
  // Set proper headers for download
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Length', stat.size);
  
  // Stream the file
  const fileStream = fs.createReadStream(filePath);
  fileStream.pipe(res);
});

module.exports = router;