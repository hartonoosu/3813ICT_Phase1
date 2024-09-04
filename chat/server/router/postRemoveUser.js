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
  } catch (err) {
    console.error(`Error writing file to disk: ${err}`);
  }
};

module.exports = (req, res) => {
  const { username } = req.params;

  // Read existing users from users.json
  let users = readJsonFile(usersFilePath);
  const initialLength = users.length;

  // Remove user with the specified username
  users = users.filter(user => user.username !== username);

  // If no user was removed, return 404
  if (users.length === initialLength) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Write the updated users array back to users.json
  writeJsonFile(usersFilePath, users);

  // Also remove the extended user profile data from extendeduser.json
  let extendedUsers = readJsonFile(extendedUsersFilePath);
  extendedUsers = extendedUsers.filter(user => user.username !== username);
  writeJsonFile(extendedUsersFilePath, extendedUsers);

  // Respond to the client
  res.status(200).json({ message: 'User removed successfully' });
};
