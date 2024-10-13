const fs = require('fs');
const path = require('path');

// File paths
const groupsFilePath = path.join(__dirname, '../data/groups.json');
const usersFilePath = path.join(__dirname, '../data/users.json');

module.exports = (req, res) => {
    const { groupId, channelId, username } = req.body;

    // Read existing users from users.json
    const users = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));

    // Check if the user exists
    const user = users.find(user => user.username.toLowerCase() === username.toLowerCase());
    if (!user) {
        return res.status(400).send({ error: "User does not exist" });
    }

    // Read existing groups and channels from groups.json
    const groups = JSON.parse(fs.readFileSync(groupsFilePath, 'utf-8'));

    // Find the group
    const group = groups.find(g => g.groupId === groupId);
    if (!group) {
        return res.status(404).send({ error: "Group not found" });
    }

    // Check if the user is a member of the group
    if (!group.members.includes(username)) {
        return res.status(400).send({ error: "User is not a member of the group" });
    }

    // Find the channel within the group
    const channel = group.channels.find(c => c.channelId === channelId);
    if (!channel) {
        return res.status(404).send({ error: "Channel not found" });
    }

    // Check if the user is already added to the channel
    if (channel.members && channel.members.includes(username)) {
        return res.status(400).send({ error: "User already in channel" });
    }

    // Add user to channel's members list
    if (!channel.members) {
        channel.members = [];
    }
    channel.members.push(username);

    // Write the updated groups back to the file
    fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2), 'utf-8');
    res.status(200).send({ message: "User added to channel successfully" });
};
