import './db.js'; // MongoDB connection
import express from 'express';
import cors from 'cors';
import http from 'http'; // For creating the HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import avatars from './uploads/avatars.js'; // Import the avatars route
import Message from './models/Message.js'; // Import the Message model

// Import route handlers
import postLogin from './router/postLogin.js';
import postLoginAfter from './router/postLoginAfter.js';
import postCreateUser from './router/postCreateUser.js';
import postRemoveUser from './router/postRemoveUser.js';
import getGroupsAndChannels from './router/getGroupsAndChannels.js';
import manageGroups from './router/manageGroups.js';
import manageChannels from './router/manageChannels.js';
import manageUsers from './router/manageUsers.js';
import addUserToChannel from './router/addUserToChannel.js';
import removeUserFromChannel from './router/removeUserFromChannel.js';
import getMessages from './router/getMessages.js';
import getChannel from './router/getChannel.js'; // Correct import for channels

const PORT = 3000;
const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the uploads directory as static files
app.use('/uploads', express.static('uploads'));

// Registering routes - Updated order and fixed registration for clarity
app.post('/login', postLogin);
app.post('/loginafter', postLoginAfter);
app.post('/createUser', postCreateUser);
app.delete('/removeUser/:username', postRemoveUser);
app.get('/get-groups-and-channels', getGroupsAndChannels);
app.post('/create-group', manageGroups);
app.post('/create-channel', manageChannels);
app.delete('/delete-group', manageGroups);
app.delete('/delete-channel', manageChannels);
app.post('/add-user-to-group', manageUsers);
app.post('/remove-user-from-group', manageUsers);
app.post('/add-user-to-channel', addUserToChannel);
app.post('/remove-user-from-channel', removeUserFromChannel);
app.post('/get-messages', getMessages);
app.post('/get-channel', getChannel); // Correct route for fetching channels

// Use avatar routes
app.use(avatars);

// Create HTTP server to work with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO on the server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, you can restrict this if needed
    methods: ["GET", "POST"],
  },
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for joining a channel
  // Listen for joining a channel
socket.on('joinChannel', async ({ channelId, username }) => {
  console.log(`joinChannel request received - username: ${username}, channelId: ${channelId}`);

  if (!channelId) {
    console.error('Error: channelId is undefined in joinChannel request.');
    return;
  }

  console.log(`${username} is joining channel: ${channelId}`);

  // Leave all other channels before joining a new one
  const rooms = Array.from(socket.rooms);
  rooms.forEach((room) => {
    if (room !== socket.id) {
      socket.leave(room);
    }
  });

  // Join the new channel
  socket.join(channelId);
  io.to(channelId).emit('userJoined', `${username} has joined the channel.`);

  // Fetch last 50 messages for this channel from MongoDB and send them to the user
  try {
    const messages = await Message.find({ channelId }).sort({ timestamp: 1 }).limit(50);
    socket.emit('previousMessages', messages); // Send previous messages to the user who joined
    console.log('Previous messages sent to:', socket.id);
  } catch (err) {
    console.error('Error fetching previous messages:', err);
  }
});


  // Handle sending messages
  socket.on('sendMessage', async ({ channelId, message, username }) => {
    if (!channelId || !message || !username) {
      console.error(`Missing required fields - channelId: ${channelId}, message: ${message}, username: ${username}`);
      return;
    }

    console.log(`Received message from ${username}: ${message} in channel: ${channelId}`);

    // Save the message to the database
    try {
      const newMessage = new Message({
        messageId: socket.id,
        channelId,
        userId: socket.id,
        username,
        content: message,
        timestamp: new Date(),
      });

      await newMessage.save(); // Save message to MongoDB
      console.log('Message saved to database');
    } catch (error) {
      console.error('Error saving message:', error);
    }

    // Emit the message to all users in the channel, including the sender
    io.to(channelId).emit('receiveMessage', `${username}: ${message}`);
    console.log('Sending message to channel:', channelId);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server with Socket.IO support
server.listen(PORT, () => {
  console.log('Server listening on: ' + PORT);
});
