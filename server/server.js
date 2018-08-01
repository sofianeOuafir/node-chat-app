const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var publicPath = path.join(__dirname + '/../public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('New user connected');

  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'A new user joined',
    createdAt: new Date().getTime()
  });

  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat',
    createdAt: new Date().getTime()
  });

  socket.on('createMessage', (email) => {
    console.log('create Email', email);
    email.createdAt = new Date().getTime();
    var {from, text, createdAt} = email;
    io.emit('newMessage', {
      from,
      text,
      createdAt
    });
  });
});

server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});