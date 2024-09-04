const fs = require('fs');
const path = require('path');

// File paths
const usersFilePath = path.join(__dirname, '../data/users.json');
const extendedUsersFilePath = path.join(__dirname, '../data/extendedUsers.json');

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

  // Read existing users from users.json
  const users = readJsonFile(usersFilePath);

  // Check if username already exists
  const existingUser = users.find(user => user.username === username);
  if (existingUser) {
    return res.status(409).json({ message: 'Username already exists' });
  }

  // Generate new user data
  const newUser = {
    username: username,
    pwd: generateRandomPassword()  // Generate a random password
  };

  // Add the new user to the users array
  users.push(newUser);

  // Write updated users array back to users.json
  writeJsonFile(usersFilePath, users);

  // Also add extended user profile data to extendedUsers.json
  const extendedUsers = readJsonFile(extendedUsersFilePath);
  console.log('Extended users before adding:', extendedUsers);

  const newExtendedUser = {
    userid: generateUniqueId(),  // Generate a unique 5-character ID
    username: username,
    useremail: useremail,
    usergroup: usergroup,
    userrole: userrole
  };

  extendedUsers.push(newExtendedUser);
  console.log('Extended users after adding:', extendedUsers);

  writeJsonFile(extendedUsersFilePath, extendedUsers);

  // Respond to the client
  res.status(201).json({
    message: 'User created successfully',
    username: newUser.username,
    password: newUser.pwd  // Send the generated password to the client
  });
};
