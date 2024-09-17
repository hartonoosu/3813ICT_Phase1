const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    const groupsFilePath = path.join(__dirname, "../data/groups.json");

    fs.readFile(groupsFilePath, "utf-8", function(err, data) {
        if (err) throw err;

        let groups = JSON.parse(data);
        res.send(groups);  // Send all groups and channels as the response
    });
};
