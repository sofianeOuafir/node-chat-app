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
const {Users} = require('./utils/users');
var users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  socket.on('join', (params, callback) => {
    var {name, room} = params;
    var errors;
    if(!isRealString(name) || !isRealString(room)){
      return callback('Name and room name are required');
    }

    socket.join(room);
    users.removeUser(socket.id);
    users.addUser(socket.id, name, room);
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

    io.to(room).emit('updateUserList', users.getAllUser(room));
    socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${name} has joined.`));

    callback();
  });

  socket.on('disconnect', () => {
    var user = users.removeUser(socket.id);

    if(user){
      io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left.`));
      io.to(user.room).emit('updateUserList', users.getAllUser(user.room));
    }
  });

  socket.on('createMessage', (message, callback) => {
    var user = users.getUser(socket.id);
    if(user && isRealString(message.text)){
      io.to(user.room).emit('newMessage',  generateMessage(user.name, message.text));
    }
    callback();
  });

  socket.on('createLocationMessage', (message) => {
    var user = users.getUser(socket.id);
    if(user){
      io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, message.latitude, message.longitude));
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is up on port ${PORT}`);
});