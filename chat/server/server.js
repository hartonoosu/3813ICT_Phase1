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

http.listen(PORT, () => {
    console.log('Server listening on: ' + PORT);
});
