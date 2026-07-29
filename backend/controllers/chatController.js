const Conversation = require('../models/Conversation');
const Message = require('../models/Message');
const User = require('../models/User');

// @desc    Get all conversations for logged in user
// @route   GET /api/chat
// @access  Private
const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      participants: req.user._id
    })
    .populate('participants', 'name email profile.gender')
    .sort({ lastMessageAt: -1 });
    
    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get messages for a specific conversation
// @route   GET /api/chat/:conversationId
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Message.find({
      conversationId: req.params.conversationId
    }).sort({ createdAt: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a message (and create conversation if none exists)
// @route   POST /api/chat/message
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { receiverId, text } = req.body;
    const senderId = req.user._id;

    if (!receiverId || !text) {
      return res.status(400).json({ message: 'Please provide receiverId and text' });
    }

    // Find if conversation exists between these two users
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      // Create new conversation
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        lastMessage: text,
        lastMessageAt: Date.now()
      });
    } else {
      // Update existing conversation
      conversation.lastMessage = text;
      conversation.lastMessageAt = Date.now();
      await conversation.save();
    }

    // Create the message
    const newMessage = await Message.create({
      conversationId: conversation._id,
      sender: senderId,
      text: text,
    });

    // Populate sender info for the socket event
    const populatedMessage = await newMessage.populate('sender', 'name');

    // Emit socket event to the receiver's private room
    const io = req.app.get('io');
    if (io) {
      // We emit to the receiver's private room
      io.to(receiverId.toString()).emit('receive_chat_message', populatedMessage);
      // We also emit to the sender's private room (so if they have multiple tabs open, it syncs)
      io.to(senderId.toString()).emit('receive_chat_message', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getConversations,
  getMessages,
  sendMessage
};
