const express = require('express');
const router = express.Router();
const {
  getConversations,
  getMessages,
  sendMessage
} = require('../controllers/chatController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getConversations);

router.route('/message')
  .post(protect, sendMessage);

router.route('/:conversationId')
  .get(protect, getMessages);

module.exports = router;
