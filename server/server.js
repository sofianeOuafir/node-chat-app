const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var publicPath = path.join(__dirname + '/../public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var {generateMessage} = require('./utils/message.js');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user joined'));

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

  socket.on('createMessage', (email) => {
    console.log('create Email', email);
    email.createdAt = new Date().getTime();
    var {from, text, createdAt} = email;
    io.emit('newMessage',  generateMessage(from, text));
  });
});

server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});