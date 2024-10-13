import fs from 'fs';
import path from 'path';
import mongoose from 'mongoose';
import User from './models/User.js';
import Group from './models/Group.js';
import Message from './models/Message.js';
const { ObjectId } = mongoose.Types;

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/chatapp')
  .then(() => {
    console.log('Connected to MongoDB');
    migrateData(); // Start the migration after connecting
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });

// File paths
const usersFilePath = path.join(process.cwd(), './data/users.json');
const groupsFilePath = path.join(process.cwd(), './data/groups.json');
const messagesFilePath = path.join(process.cwd(), './data/messages.json');

// Helper function to validate if a string can be an ObjectId
function isValidObjectId(id) {
  return /^[a-fA-F0-9]{24}$/.test(id);
}

// Function to migrate data
async function migrateData() {
  try {
    // 1. Migrate Users Data
    const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf-8'));
    await User.insertMany(usersData);
    console.log('Users data migrated successfully');

    // 2. Migrate Groups Data
    let groupsData = JSON.parse(fs.readFileSync(groupsFilePath, 'utf-8'));
    groupsData = groupsData.map(group => {
      return {
        ...group,
        channels: group.channels.map(channel => ({
          ...channel,
          channelId: isValidObjectId(channel.channelId) ? new ObjectId(channel.channelId) : new ObjectId() // Assign new ObjectId if invalid
        })),
        members: group.members.map(memberId => isValidObjectId(memberId) ? new ObjectId(memberId) : new ObjectId()) // Convert member IDs to ObjectId or create a new one if invalid
      };
    });
    await Group.insertMany(groupsData);
    console.log('Groups data migrated successfully');

    // 3. Migrate Messages Data
    let messagesData = JSON.parse(fs.readFileSync(messagesFilePath, 'utf-8'));
    messagesData = messagesData.map(message => {
      return {
        ...message,
        channelId: isValidObjectId(message.channelId) ? new ObjectId(message.channelId) : new ObjectId(), // Convert channelId to ObjectId or create a new one if invalid
        userId: isValidObjectId(message.userId) ? new ObjectId(message.userId) : new ObjectId() // Convert userId to ObjectId or create a new one if invalid
      };
    });
    await Message.insertMany(messagesData);
    console.log('Messages data migrated successfully');

    // Close the connection after migration
    mongoose.connection.close();
  } catch (err) {
    console.error('Error during data migration:', err);
    mongoose.connection.close();
  }
}
