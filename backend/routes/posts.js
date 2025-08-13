const express = require('express');
const { body } = require('express-validator');
const { 
  createPost, 
  getPosts, 
  getUserPosts, 
  toggleLike, 
  deletePost 
} = require('../controllers/postsController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Validation rules
const postValidation = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Post content must be between 1 and 2000 characters')
];

// Routes
router.post('/', protect, postValidation, createPost);
router.get('/', protect, getPosts);
router.get('/user/:userId', protect, getUserPosts);
router.put('/:id/like', protect, toggleLike);
router.delete('/:id', protect, deletePost);

module.exports = router;
