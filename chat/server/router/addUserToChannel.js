import User from '../models/User.js';
import Group from '../models/Group.js';

export default async (req, res) => {
    try {
        const { groupId, channelId, username } = req.body;

        // Validate request data
        if (!groupId || !channelId || !username) {
            return res.status(400).send({ error: "Group ID, Channel ID, and Username are required" });
        }

        // Find the user in the database
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (!user) {
            return res.status(400).send({ error: "User does not exist" });
        }

        // Find the group in the database
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).send({ error: "Group not found" });
        }

        // Check if the user is a member of the group
        if (!group.members.includes(user._id)) {
            return res.status(400).send({ error: "User is not a member of the group" });
        }

        // Find the channel within the group
        const channel = group.channels.find(c => c._id.toString() === channelId);
        if (!channel) {
            return res.status(404).send({ error: "Channel not found" });
        }

        // Check if the user is already added to the channel
        if (channel.members && channel.members.includes(user._id)) {
            return res.status(400).send({ error: "User already in channel" });
        }

        // Add user to channel's members list
        if (!channel.members) {
            channel.members = [];
        }
        channel.members.push(user._id);

        // Save the updated group
        await group.save();

        res.status(200).send({ message: "User added to channel successfully" });
    } catch (err) {
        console.error("An error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
};
