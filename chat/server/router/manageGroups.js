const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    const groupsFilePath = path.join(__dirname, "../data/groups.json");

    if (req.method === "POST" && req.url === "/create-group") {
        // Handle group creation
        fs.readFile(groupsFilePath, "utf-8", function(err, data) {
            if (err) throw err;

            let groups = JSON.parse(data);
            const newGroupName = req.body.groupName.trim();

            // Check if the group name already exists
            const groupExists = groups.some(group => group.groupName.toLowerCase() === newGroupName.toLowerCase());

            if (groupExists) {
                return res.status(400).send({ error: "Group name already exists" });
            }

            const newGroup = {
                groupId: Date.now().toString(),  // Unique ID based on timestamp
                groupName: newGroupName,
                channels: [],
                members: []
            };

            groups.push(newGroup);

            fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), "utf-8", function(err) {
                if (err) throw err;
                res.send(newGroup);  // Send the newly created group as a response
            });
        });
    } else if (req.method === "DELETE" && req.url === "/delete-group") {
        // Handle group deletion
        fs.readFile(groupsFilePath, "utf-8", function(err, data) {
            if (err) throw err;

            let groups = JSON.parse(data);
            const groupIdToDelete = req.body.groupId;

            // Filter out the group with the specified ID
            const updatedGroups = groups.filter(g => g.groupId !== groupIdToDelete);

            if (updatedGroups.length === groups.length) {
                return res.status(404).send({ error: "Group not found" });
            }

            // Write the updated list back to the file
            fs.writeFile(groupsFilePath, JSON.stringify(updatedGroups, null, 2), "utf-8", function(err) {
                if (err) throw err;
                res.send({ message: "Group deleted successfully" });
            });
        });
    } else {
        res.status(405).send({ error: "Method not allowed" });
    }
};
