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

    const messages = await Message.find({ channelId }).sort({ timestamp: 1 });
    res.status(200).json(messages);
  } catch (err) {
    console.error('An error occurred while fetching messages:', err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

export default router;