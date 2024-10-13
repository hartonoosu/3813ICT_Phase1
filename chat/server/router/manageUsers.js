import User from '../models/User.js';
import Group from '../models/Group.js';
import mongoose from 'mongoose';

const { ObjectId } = mongoose.Types;

export default async function (req, res) {
    try {
        const { groupId, username } = req.body;

        if (!groupId || !username) {
            console.error("Group ID or Username is missing in the request");
            return res.status(400).send({ error: "Group ID and Username are required" });
        }

        // Log groupId received in the request
        console.log("Received groupId as:", groupId);

        // Convert groupId to a MongoDB ObjectId
        const groupObjectId = new ObjectId(groupId);

        // Log the converted ObjectId for debugging
        console.log("Converted to ObjectId:", groupObjectId);

        // Find the group by the converted ObjectId
        const group = await Group.findById(groupObjectId);
        if (!group) {
            console.error("Group not found");
            return res.status(404).send({ error: "Group not found" });
        }

        // Find the user by username
        const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
        if (!user) {
            console.error("User does not exist");
            return res.status(400).send({ error: "User does not exist" });
        }

        // Check if the user is already in the group
        const userAlreadyInGroup = group.members.some(memberId => memberId.toString() === user._id.toString());
        if (userAlreadyInGroup) {
            return res.status(400).send({ error: "User is already a member of this group" });
        }

        // Add the user to the members array
        group.members.push(user._id);

        // Save the updated group document
        await group.save();

        res.send({ message: "User added to the group successfully" });
    } catch (err) {
        console.error("An error occurred during operation:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}
