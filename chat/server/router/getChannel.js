import express from 'express';
import Group from '../models/Group.js';  // Assuming Group model is defined to manage groups and channels

const router = express.Router();

router.post('/get-channel', async (req, res) => {
  try {
    const { groupName } = req.body;

    console.log(`Request to get channels for group: ${groupName}`); // Log request

    // Find the group by its name and get the channels
    const group = await Group.findOne({ groupName });

    if (!group) {
      console.error('Group not found:', groupName);
      return res.status(404).json({ message: 'Group not found' });
    }

    // Return the channels in the group
    res.status(200).json({ channels: group.channels });
  } catch (error) {
    console.error('Failed to load channels:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


export default router;
