import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

// Route to get messages for a specific channel
router.post('/get-messages', async (req, res) => {
  try {
    const { channelId } = req.body;

    if (!channelId) {
      return res.status(400).json({ error: 'Channel ID is required' });
    }

    // Fetch messages and convert to plain objects for easier manipulation
    const messages = await Message.find({ channelId }).sort({ timestamp: 1 }).lean();

    // Ensure avatarUrl is correctly formatted before sending
    const messagesWithAvatarUrl = messages.map(message => ({
      ...message,
      avatarUrl: message.avatar ? `../uploads/avatars/${message.avatar}` : '' 
    }));

    res.status(200).json(messagesWithAvatarUrl);
  } catch (err) {
    console.error('An error occurred while fetching messages:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export default router;
