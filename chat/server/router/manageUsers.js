const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    const groupsFilePath = path.join(__dirname, "../data/groups.json");
    const usersFilePath = path.join(__dirname, "../data/users.json");

    if (req.method === "POST" && req.url === "/add-user-to-group") {
        fs.readFile(usersFilePath, "utf-8", function(err, userData) {
            if (err) throw err;

            let users = JSON.parse(userData);
            const { groupId, username } = req.body;

            if (!username) {
                console.error("Username is missing in the request");
                return res.status(400).send({ error: "Username is required" });
            }

            const user = users.find(user => user.username.toLowerCase() === username.toLowerCase());

            if (!user) {
                console.error("User does not exist:", username);
                return res.status(400).send({ error: "User does not exist" });
            }

            fs.readFile(groupsFilePath, "utf-8", function(err, groupData) {
                if (err) throw err;

                let groups = JSON.parse(groupData);

                const group = groups.find(g => g.groupId === groupId);

                if (!group) {
                    console.error("Group not found:", groupId);
                    return res.status(404).send({ error: "Group not found" });
                }

                if (group.members.includes(user.username)) {
                    console.error("User already in group:", username);
                    return res.status(400).send({ error: "User already in group" });
                }

                group.members.push(user.username);

                fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), "utf-8", function(err) {
                    if (err) throw err;
                    res.send({ message: "User added successfully" });
                });
            });
        });
    } else if (req.method === "POST" && req.url === "/remove-user-from-group") {
        fs.readFile(groupsFilePath, "utf-8", function(err, data) {
            if (err) throw err;

            let groups = JSON.parse(data);
            const { groupId, username } = req.body;

            if (!username) {
                console.error("Username is missing in the request");
                return res.status(400).send({ error: "Username is required" });
            }

            const group = groups.find(g => g.groupId === groupId);

            if (!group) {
                console.error("Group not found:", groupId);
                return res.status(404).send({ error: "Group not found" });
            }

            const userExistsInGroup = group.members.some(
                memberUsername => memberUsername.toLowerCase() === username.toLowerCase()
            );

            if (!userExistsInGroup) {
                console.error("User not found in group:", username);
                return res.status(404).send({ error: "User not found in group" });
            }

            group.members = group.members.filter(memberUsername => memberUsername.toLowerCase() !== username.toLowerCase());

            fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), "utf-8", function(err) {
                if (err) throw err;
                res.send({ message: "User removed successfully" });
            });
        });
    } else {
        res.status(405).send({ error: "Method not allowed" });
    }
};
