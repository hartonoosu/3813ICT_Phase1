import './db.js'; // MongoDB connection
import express from 'express';
import cors from 'cors';
import http from 'http'; // For creating the HTTP server
import { Server } from 'socket.io'; // Import Socket.IO
import avatars from './uploads/avatars.js'; // Import the avatars route

const PORT = 3000;
const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve the uploads directory as static files
app.use('/uploads', express.static('uploads'));

// Route imports
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

// Route handlers
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

// Use avatar routes
app.use(avatars);

// Create HTTP server to work with Socket.IO
const server = http.createServer(app);

// Initialize Socket.IO on the server
const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins, you can restrict this if needed
    methods: ["GET", "POST"]
  }
});

// Socket.IO events
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Listen for joining a channel
  socket.on('joinChannel', ({ channelId, username }) => {
    socket.join(channelId);
    io.to(channelId).emit('userJoined', `${username} joined the channel`);
  });

  // Listen for sending messages in a channel
  socket.on('sendMessage', ({ channelId, message }) => {
    io.to(channelId).emit('receiveMessage', message);
  });

  // Listen for leaving a channel
  socket.on('leaveChannel', ({ channelId, username }) => {
    socket.leave(channelId);
    io.to(channelId).emit('userLeft', `${username} left the channel`);
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
