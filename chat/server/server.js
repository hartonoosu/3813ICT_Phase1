const PORT = 3000;

const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const http = require('http').Server(app);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post('/login', require('./router/postLogin'));
app.post('/loginafter', require('./router/postLoginAfter'));
app.post('/createUser', require('./router/postCreateUser'));
app.delete('/removeUser/:username', require('./router/postRemoveUser'));
app.get("/get-groups-and-channels", require("./router/getGroupsAndChannels"));
app.post("/create-group", require("./router/manageGroups"));
app.post("/create-channel", require("./router/manageChannels"));
app.delete("/delete-group", require("./router/manageGroups"));
app.delete("/delete-channel", require("./router/manageChannels"));
app.post("/add-user-to-group", require("./router/manageUsers"));
app.post("/remove-user-from-group", require("./router/manageUsers"));
app.post("/add-user-to-channel", require("./router/addUserToChannel"));


http.listen(PORT, () => {
    console.log('Server listening on: ' + PORT);
});
