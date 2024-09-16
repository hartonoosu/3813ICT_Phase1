const fs = require('fs');

module.exports = function(req, res) {
    // Retrieve the username and password from the request body
    const u = req.body.username; 
    const p = req.body.pwd; 

    // Log the combined username and password for debugging
    console.log("Attempting login for: ", u);

    // Read the users.json file
    fs.readFile('./data/users.json', 'utf8', function(err, data) {
        // Handle any errors that occur while reading the file
        if (err) throw err;

        // Parse the JSON data into an array
        let userArray = JSON.parse(data);

        // Find the user with the matching username and password
        let i = userArray.findIndex(user => (user.username == u && user.pwd == p));
        
        if (i == -1) {
            // If no matching user is found, send a response indicating failure
            res.send({ "ok": false });
        } else {
            // If a matching user is found, prepare the response data
            let userData = userArray[i];

            // Add a success indicator to the userData object
            userData["ok"] = true;

            // Remove the password from the response for security reasons
            delete userData.pwd;

            // Send the user data back as the response
            res.send(userData);
        }
    });
};
