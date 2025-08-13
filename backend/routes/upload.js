const express = require('express');
const { upload, uploadImage, uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Single image upload
router.post('/image', protect, upload.single('image'), uploadImage);

// Multiple images upload
router.post('/images', protect, upload.array('images', 5), uploadImages);

module.exports = router;
