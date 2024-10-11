import Group from '../models/Group.js';
import User from '../models/User.js';

export default async function(req, res) {
    try {
        const { groupId, channelId, username } = req.body;

        // Validate request data
        if (!groupId || !channelId || !username) {
            console.error("Group ID, Channel ID, or Username is missing in the request");
            return res.status(400).send({ error: "Group ID, Channel ID, and Username are required" });
        }

        // Find the group in the database
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).send({ error: "Group not found" });
        }

        // Find the channel within the group
        const channel = group.channels.find(c => c.channelId === channelId);
        if (!channel) {
            return res.status(404).send({ error: "Channel not found" });
        }

        // Find the user in the database
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (!user) {
            return res.status(400).send({ error: "User does not exist" });
        }

        // Check if the user exists in the channel
        if (!channel.members || !channel.members.includes(user._id)) {
            return res.status(404).send({ error: "User not found in channel" });
        }

        // Remove user from channel's members list
        channel.members = channel.members.filter(member => !member.equals(user._id));

        // Save the updated group
        await group.save();

        res.status(200).send({ message: "User removed from channel successfully" });
    } catch (err) {
        console.error("An error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}
