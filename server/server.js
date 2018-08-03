const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var publicPath = path.join(__dirname + '/../public');
const PORT = process.env.PORT || 3000;
var app = express();
var server = http.createServer(app);
var io = socketIO(server);
var {generateMessage, generateLocationMessage} = require('./utils/message.js');
const {isRealString} = require('./utils/validation.js');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    console.log(params);
    var {name, room} = params;
    var errors;
    if(!isRealString(name) || !isRealString(room)){
      return callback('Name and room name are required');
    }

    callback();
  });

  socket.on('disconnect', () => {
    console.log('User has disconnected');
  });

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'A new user joined'));

  socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

  socket.on('createMessage', (message, callback) => {
    io.emit('newMessage',  generateMessage(message.from, message.text));
    callback();
  });

  socket.on('createLocationMessage', (message) => {
    io.emit('newLocationMessage', generateLocationMessage('User', message.latitude, message.longitude));
  });
});

server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});