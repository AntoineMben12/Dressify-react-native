const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/auth');
const Chat = require('../models/Chat');
const Message = require('../models/Message');

const router = express.Router();

// @desc    Get user chats
// @route   GET /api/chats
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const chats = await Chat.find({
      participants: req.user.id
    })
    .populate('participants', 'name avatar')
    .populate('lastMessage')
    .sort({ lastActivity: -1 });

    res.status(200).json({
      success: true,
      chats
    });
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching chats'
    });
  }
});

// @desc    Create or get chat
// @route   POST /api/chats
// @access  Private
router.post('/', protect, [
  body('participantId').isMongoId().withMessage('Valid participant ID is required')
], async (req, res) => {
  try {
    const { participantId } = req.body;
    
    // Check if chat already exists
    let chat = await Chat.findOne({
      participants: { $all: [req.user.id, participantId] },
      isGroupChat: false
    }).populate('participants', 'name avatar');

    if (!chat) {
      // Create new chat
      chat = await Chat.create({
        participants: [req.user.id, participantId]
      });
      
      await chat.populate('participants', 'name avatar');
    }

    res.status(200).json({
      success: true,
      chat
    });
  } catch (error) {
    console.error('Create chat error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating chat'
    });
  }
});

// @desc    Send message
// @route   POST /api/chats/:chatId/messages
// @access  Private
router.post('/:chatId/messages', protect, [
  body('content').trim().isLength({ min: 1, max: 1000 }).withMessage('Message content is required')
], async (req, res) => {
  try {
    const { chatId } = req.params;
    const { content, messageType = 'text', media } = req.body;

    // Check if chat exists and user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    const message = await Message.create({
      chat: chatId,
      sender: req.user.id,
      content,
      messageType,
      media
    });

    await message.populate('sender', 'name avatar');

    // Update chat's last message and activity
    chat.lastMessage = message._id;
    chat.lastActivity = new Date();
    await chat.save();

    res.status(201).json({
      success: true,
      message
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while sending message'
    });
  }
});

// @desc    Get chat messages
// @route   GET /api/chats/:chatId/messages
// @access  Private
router.get('/:chatId/messages', protect, async (req, res) => {
  try {
    const { chatId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    const skip = (page - 1) * limit;

    // Check if user is participant
    const chat = await Chat.findOne({
      _id: chatId,
      participants: req.user.id
    });

    if (!chat) {
      return res.status(404).json({
        success: false,
        message: 'Chat not found or access denied'
      });
    }

    const messages = await Message.find({ chat: chatId })
      .populate('sender', 'name avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Message.countDocuments({ chat: chatId });

    res.status(200).json({
      success: true,
      messages: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching messages'
    });
  }
});

module.exports = router;
