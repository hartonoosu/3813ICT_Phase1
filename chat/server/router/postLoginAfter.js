const fs = require("fs");
const path = require("path");

module.exports = function(req, res) {
    // Create a user object based on the request body
    let userobj = {
        "userid": req.body.userid,
        "pwd": req.body.pwd,  // Password right after userid
        "username": req.body.username,
        "useremail": req.body.useremail,
        "usergroup": req.body.usergroup,
        "userrole": req.body.userrole
    };

    // Path to the users data file
    const usersFilePath = path.join(__dirname, "../data/users.json");

    // Initialize an array to hold the users data
    let uArray = [];

    // Read the users.json file
    fs.readFile(usersFilePath, "utf-8", function(err, data) {
        if (err) throw err;

        // Parse the JSON data into an array
        uArray = JSON.parse(data);

        // Log the user object for debugging
        console.log("test: ", userobj);

        // Find the index of the existing user by username
        let i = uArray.findIndex(x => x.username == userobj.username);

        // Send the updated user data back as the response
        res.send(userobj);

        // Convert the updated users array back to JSON
        let uArrayJson = JSON.stringify(uArray, null, 2); // The `null, 2` adds indentation for readability

        // Write the updated users array back to users.json
        fs.writeFile(usersFilePath, uArrayJson, "utf-8", function(err) {
            if (err) throw err;
        });
    });
};
