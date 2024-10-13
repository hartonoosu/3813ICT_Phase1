import Group from '../models/Group.js';
import express from 'express';

const router = express.Router();

// Route to get all groups and their channels
router.get('/get-groups-and-channels', async (req, res) => {
    try {
        // Fetch all groups and populate members and channels
        const groups = await Group.find()
            .populate({ path: 'members', select: 'username' }) // Populate group members
            .populate({ path: 'channels.members', select: 'username' }); // Populate channel members

        res.status(200).send(groups);  // Send all groups and channels as the response
    } catch (err) {
        console.error("An error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
});

// Route to get channels for a specific group
router.post('/get-channels', async (req, res) => {
    try {
        const { groupName } = req.body;

        // Ensure groupName is provided
        if (!groupName) {
            return res.status(400).json({ message: 'Group name is required' });
        }

        // Find the group by its name
        const group = await Group.findOne({ groupName })
            .populate({ path: 'channels.members', select: 'username' }); // Populate channel members

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Return the channels of the group
        res.status(200).json({ channels: group.channels });
    } catch (err) {
        console.error("An error occurred while fetching channels:", err);
        res.status(500).send({ error: "Internal server error" });
    }
});

export default router;
