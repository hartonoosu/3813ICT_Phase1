const fs = require('fs');
const path = require('path');

// File paths
const groupsFilePath = path.join(__dirname, '../data/groups.json');

module.exports = (req, res) => {
    const { groupId, channelId, username } = req.body;

    // Read existing groups and channels from groups.json
    const groups = JSON.parse(fs.readFileSync(groupsFilePath, 'utf-8'));

    // Find the group
    const group = groups.find(g => g.groupId === groupId);
    if (!group) {
        return res.status(404).send({ error: "Group not found" });
    }

    // Find the channel within the group
    const channel = group.channels.find(c => c.channelId === channelId);
    if (!channel) {
        return res.status(404).send({ error: "Channel not found" });
    }

    // Check if the user exists in the channel
    if (!channel.members || !channel.members.includes(username)) {
        return res.status(404).send({ error: "User not found in channel" });
    }

    // Remove user from channel's members list
    channel.members = channel.members.filter(member => member !== username);

    // Write the updated groups back to the file
    fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2), 'utf-8');
    res.status(200).send({ message: "User removed from channel successfully" });
};
