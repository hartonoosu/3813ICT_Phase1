import './db.js'; // MongoDB connection
import express from 'express';
import cors from 'cors';
import http from 'http'; // For creating the HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import avatars from './uploads/avatars.js'; // Import the avatars route
import Message from './models/Message.js'; // Import the Message model
import uploadImage from './router/uploadImage.js'; // Import the new route for uploading images

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

// Registering routes
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
app.post('/get-channel', getChannel);
app.use(avatars);
app.use(uploadImage); // Add the new upload image route

// Create HTTP server to work with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO on the server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('joinChannel', async ({ channelId, username }) => {
    console.log(`${username} is joining channel: ${channelId}`);

    if (!channelId) {
      console.error('Error: channelId is undefined in joinChannel request.');
      return;
    }

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
      socket.emit('previousMessages', messages);
    } catch (err) {
      console.error('Error fetching previous messages:', err);
    }
  });

  socket.on('sendMessage', async ({ channelId, message, username, avatarUrl }) => {
    if (!channelId || !message || !username) {
      console.error(`Missing required fields - channelId: ${channelId}, message: ${message}, username: ${username}`);
      return;
    }

    console.log(`Received message from ${username}: ${message} in channel: ${channelId}`);

    try {
      const newMessage = new Message({
        messageId: socket.id,
        channelId,
        userId: socket.id,
        username,
        avatarUrl,
        content: message,
        timestamp: new Date(),
      });

      await newMessage.save();
      io.to(channelId).emit('receiveMessage', {
        username,
        content: message,
        avatarUrl,
      });
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('sendImage', async ({ channelId, username, avatarUrl, imageUrl }) => {
    if (!channelId || !username || !imageUrl) {
      console.error('Missing required fields for sending image');
      return;
    }

    try {
      const newMessage = new Message({
        messageId: socket.id,
        channelId,
        userId: socket.id,
        username,
        avatarUrl,
        content: `<img src="${imageUrl}" alt="Image message" />`,
        timestamp: new Date(),
      });

      await newMessage.save();
      io.to(channelId).emit('receiveMessage', {
        username,
        content: `<img src="${imageUrl}" alt="Image message" />`,
        avatarUrl,
      });
    } catch (error) {
      console.error('Error saving image message:', error);
    }
  });

  socket.on('setAvatar', async ({ userId, avatarUrl }) => {
    // Update avatar URL in session or user data
    // Here you would typically update the avatar URL in your database
    io.to(socket.id).emit('avatarUpdated', avatarUrl);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected:', socket.id);
  });
});

// Start the server
server.listen(PORT, () => {
  console.log('Server listening on: ' + PORT);
});