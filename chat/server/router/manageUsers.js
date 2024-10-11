import User from '../models/User.js';
import Group from '../models/Group.js';

export default async function(req, res) {
    try {
        // Add User to Group
        if (req.method === "POST" && req.url === "/add-user-to-group") {
            const { groupId, username } = req.body;

            // Validate request data
            if (!groupId || !username) {
                console.error("Group ID or Username is missing in the request");
                return res.status(400).send({ error: "Group ID and Username are required" });
            }

            // Find the user in the database
            const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
            if (!user) {
                console.error("User does not exist:", username);
                return res.status(400).send({ error: "User does not exist" });
            }

            // Find the group in the database
            const group = await Group.findById(groupId);
            if (!group) {
                console.error("Group not found:", groupId);
                return res.status(404).send({ error: "Group not found" });
            }

            // Check if user is already in the group
            if (group.members.includes(user._id)) {
                console.error("User already in group:", username);
                return res.status(400).send({ error: "User already in group" });
            }

            // Add user to group's members list
            group.members.push(user._id);
            await group.save();

            res.send({ message: "User added to group successfully" });

        // Remove User from Group
        } else if (req.method === "POST" && req.url === "/remove-user-from-group") {
            const { groupId, username } = req.body;

            // Validate request data
            if (!groupId || !username) {
                console.error("Group ID or Username is missing in the request");
                return res.status(400).send({ error: "Group ID and Username are required" });
            }

            // Find the group in the database
            const group = await Group.findById(groupId);
            if (!group) {
                console.error("Group not found:", groupId);
                return res.status(404).send({ error: "Group not found" });
            }

            // Find the user in the group
            const user = await User.findOne({ username: { $regex: new RegExp(`^${username}$`, 'i') } });
            if (!user) {
                console.error("User does not exist:", username);
                return res.status(400).send({ error: "User does not exist" });
            }

            const userIndex = group.members.indexOf(user._id);
            if (userIndex === -1) {
                console.error("User not found in group:", username);
                return res.status(404).send({ error: "User not found in group" });
            }

            // Remove user from group's members list
            group.members.splice(userIndex, 1);
            await group.save();

            res.send({ message: "User removed from group successfully" });

        } else {
            res.status(405).send({ error: "Method not allowed" });
        }
    } catch (err) {
        console.error("An error occurred:", err);
        res.status(500).send({ error: "Internal server error" });
    }
}
