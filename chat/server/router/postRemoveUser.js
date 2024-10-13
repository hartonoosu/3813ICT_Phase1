const fs = require('fs');
const path = require('path');

// File path to users.json
const usersFilePath = path.join(__dirname, '../data/users.json');

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

module.exports = (req, res) => {
  const { username } = req.params;

  // Read existing users from users.json
  let users = readJsonFile(usersFilePath);
  const initialLength = users.length;

  // Check if the username exists
  const userExists = users.find(user => user.username === username);
  if (!userExists) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Remove user with the specified username
  users = users.filter(user => user.username !== username);

  // Write the updated users array back to users.json
  writeJsonFile(usersFilePath, users);

  // Respond to the client
  res.status(200).json({ message: 'User removed successfully' });
};
