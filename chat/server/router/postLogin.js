import User from '../models/User.js';

export default async function(req, res) {
  try {
    // Retrieve the username and password from the request body
    const u = req.body.username;
    const p = req.body.pwd;

    // Log the combined username and password for debugging
    console.log("Attempting login for:", u);

    // Find the user with the matching username and password in the database
    const user = await User.findOne({ username: u, pwd: p });

    if (!user) {
      // If no matching user is found, send a response indicating failure
      return res.send({ "ok": false });
    }

    // Prepare the response data
    const userData = user.toObject();

    // Add a success indicator to the userData object
    userData["ok"] = true;

    // Remove the password from the response for security reasons
    delete userData.pwd;

    // Send the user data back as the response
    res.send(userData);
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send({ error: "Internal server error" });
  }
}
