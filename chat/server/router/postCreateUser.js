const fs = require('fs');
const path = require('path');

// File path to users.json and groups.json
const usersFilePath = path.join(__dirname, '../data/users.json');
const groupsFilePath = path.join(__dirname, '../data/groups.json');

// Helper function to read JSON file
const readJsonFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading file from disk: ${err}`);
    return [];
  }
};

// Helper function to write JSON file
const writeJsonFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`Data successfully written to ${filePath}`);
  } catch (err) {
    console.error(`Error writing file to disk: ${err}`);
  }
};

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

module.exports = (req, res) => {
  const { username, useremail = '', usergroup = 'default', userrole = 'user' } = req.body;

  // Read existing users and groups from their respective files
  const users = readJsonFile(usersFilePath);
  const groups = readJsonFile(groupsFilePath);

  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Check if the group exists
  const existingGroup = groups.find(group => group.groupName === usergroup);
  if (!existingGroup) {
    return res.status(400).json({ message: 'Group does not exist' });
  }

  // Generate new user data
  const newUser = {
    userid: generateUniqueId(),  // Generate a unique 5-character ID
    username: username,
    pwd: generateRandomPassword(),  // Generate a random password
    useremail: useremail,
    usergroup: usergroup,
    userrole: userrole
  };

  // Add the new user to the users array
  users.push(newUser);

  // Write updated users array back to users.json
  writeJsonFile(usersFilePath, users);

  // Respond to the client
  res.status(201).json({
    message: 'User created successfully',
    username: newUser.username,
    password: newUser.pwd  // Send the generated password to the client
  });
};
