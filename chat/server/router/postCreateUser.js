import User from '../models/User.js';
import Group from '../models/Group.js';

// Helper function to generate random password
const generateRandomPassword = (length = 8) => {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let password = '';
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper function to generate a unique 5-character ID
const generateUniqueId = (length = 5) => {
  const chars = '0123456789';
  let id = '';
  for (let i = 0; i < length; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

export default async function(req, res) {
  try {
    const { username, useremail = '', usergroup = 'default', userrole = 'user' } = req.body;

    // Validate request data
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Check if username already exists in the database
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).json({ message: 'Username already exists' });
    }

    // Check if the group exists in the database
    const existingGroup = await Group.findOne({ groupName: usergroup });
    if (!existingGroup) {
      return res.status(400).json({ message: 'Group does not exist' });
    }

    // Generate new user data
    const newUser = new User({
      userid: generateUniqueId(),  // Generate a unique 5-character ID
      username: username,
      pwd: generateRandomPassword(),  // Generate a random password
      useremail: useremail,
      usergroup: usergroup,
      userrole: userrole
    });

    // Save the new user to the database
    await newUser.save();

    // Respond to the client
    res.status(201).json({
      message: 'User created successfully',
      username: newUser.username,
      password: newUser.pwd  // Send the generated password to the client
    });
  } catch (err) {
    console.error("An error occurred:", err);
    res.status(500).send({ error: "Internal server error" });
  }
}
