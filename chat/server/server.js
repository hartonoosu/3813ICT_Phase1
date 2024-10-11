import './db.js'; // Import the MongoDB connection from db.js

import express from 'express';
import cors from 'cors';
import http from 'http'; // Import http using ES Modules syntax

const PORT = 3000;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// MongoDB connection (in db.js, which is imported at the beginning)

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

// Create HTTP server
const server = http.createServer(app);

// Listen on the specified port
server.listen(PORT, () => {
  console.log('Server listening on: ' + PORT);
});
