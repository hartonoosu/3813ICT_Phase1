const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
  const groupsFilePath = path.join(__dirname, "../data/groups.json");

  fs.readFile(groupsFilePath, "utf-8", function(err, data) {
    if (err) throw err;

    let groups = JSON.parse(data);
    const { groupId, userId } = req.body;

    // Find the group by ID
    const group = groups.find(g => g.groupId === groupId);

    if (!group) {
      return res.status(404).send({ error: "Group not found" });
    }

    // Remove the user from the group
    group.members = group.members.filter(id => id !== userId);

    // Write the updated groups back to the file
    fs.writeFile(groupsFilePath, JSON.stringify(groups, null, 2), "utf-8", function(err) {
      if (err) throw err;
      res.send({ message: "User removed successfully", group });
    });
  });
};
