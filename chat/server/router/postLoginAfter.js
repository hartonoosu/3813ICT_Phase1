import User from '../models/User.js';

export default async function (req, res) {
  try {
    // Extract the user data from request body
    const { userid, pwd, username, useremail, usergroup, userrole } = req.body;

    // Ensure the required fields are provided
    if (!userid) {
      return res.status(400).send({ message: 'User ID is required' });
    }

    // Log the user object for debugging
    console.log("Received user data for update:", { userid, username, useremail, usergroup, userrole });

    // Find the existing user by userid
    let existingUser = await User.findOne({ userid });

    if (!existingUser) {
      console.error("User not found for userid:", userid);
      return res.status(404).send({ message: 'User not found' });
    }

    // Update user fields if they exist in the request
    if (pwd) existingUser.pwd = pwd;
    if (useremail) existingUser.useremail = useremail;
    if (usergroup) existingUser.usergroup = usergroup;
    if (userrole) existingUser.userrole = userrole;

    // Save the updated user
    await existingUser.save();

    // Send the updated user data back as the response
    res.status(200).send(existingUser);
  } catch (err) {
    console.error("An error occurred while updating user data:", err);
    res.status(500).send({ error: "Internal server error" });
  }
}
