const express = require('express');
const { body } = require('express-validator');
const { addComment, getComments } = require('../controllers/commentsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const commentValidation = [
  body('postId')
    .isMongoId()
    .withMessage('Valid post ID is required'),
  body('content')
    .trim()
    .isLength({ min: 1, max: 500 })
    .withMessage('Comment must be between 1 and 500 characters')
];

// Routes
router.post('/', protect, commentValidation, addComment);
router.get('/:postId', protect, getComments);

module.exports = router;
