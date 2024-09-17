const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    const groupsFilePath = path.join(__dirname, "../data/groups.json");

    if (req.method === "POST" && req.url === "/create-channel") {
        // Handle channel creation
        fs.readFile(groupsFilePath, "utf-8", function(err, data) {
            if (err) throw err;

            let groups = JSON.parse(data);
            const { groupId, channelName } = req.body;

            // Find the group by ID
            const group = groups.find(g => g.groupId === groupId);

            if (!group) {
                return res.status(404).send({ error: "Group not found" });
            }

            // Check if the channel name already exists in this group
            if (group.channels.some(channel => channel.channelName.toLowerCase() === channelName.trim().toLowerCase())) {
                return res.status(400).send({ error: "Channel name already exists in this group" });
            }

            // Create a new channel
            const newChannel = {
                channelId: Date.now().toString(),  // Unique ID based on timestamp
                channelName: channelName.trim()
            };

            // Add the new channel to the group
            group.channels.push(newChannel);

            // Write the updated groups back to the file
            fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), "utf-8", function(err) {
                if (err) throw err;
                res.send(newChannel);  // Send the newly created channel as a response
            });
        });
    } else if (req.method === "DELETE" && req.url === "/delete-channel") {
        // Handle channel deletion
        fs.readFile(groupsFilePath, "utf-8", function(err, data) {
            if (err) throw err;

            let groups = JSON.parse(data);
            const { groupId, channelId } = req.body;

            // Find the group by ID
            const group = groups.find(g => g.groupId === groupId);

            if (!group) {
                return res.status(404).send({ error: "Group not found" });
            }

            // Filter out the channel with the specified ID
            const updatedChannels = group.channels.filter(c => c.channelId !== channelId);

            if (updatedChannels.length === group.channels.length) {
                return res.status(404).send({ error: "Channel not found" });
            }

            // Update the channels in the group
            group.channels = updatedChannels;

            // Write the updated groups back to the file
            fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), "utf-8", function(err) {
                if (err) throw err;
                res.send({ message: "Channel deleted successfully" });
            });
        });
    } else {
        res.status(405).send({ error: "Method not allowed" });
    }
};
