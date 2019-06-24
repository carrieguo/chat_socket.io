let express = require('express');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);
let clients = [];
let connectedUsers = {};

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  socket.on('come in', (name) => {
    socket.nickName = name;
    clients.push(socket);
    connectedUsers[name] = socket;

    socket.broadcast.emit('display come in', name);
    io.emit('onlineListUpdate', onlineUser());
  });

  socket.on('typing', data => {
    socket.broadcast.emit('someone typing', data);
  });

  socket.on('no typing', () => {
    socket.broadcast.emit('no one typing');
  });

  socket.on('chat message', function(name, msg) {
    socket.broadcast.emit('display chat message', name, msg);
    socket.broadcast.emit('no one typing');
  });

  socket.on('private', function(name, msg, reciver) {
    var reciverid =connectedUsers[reciver].id
    io.sockets.connected[reciverid].emit('private msg', {from: name, msg: msg});
  });

  socket.on('disconnect', (reason) => {
    delete connectedUsers[socket.nickName];
    io.emit('leave', socket.nickName);
    console.log(socket.nickName + ' leave');
    io.emit('onlineListUpdate', onlineUser());
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});

function onlineUser() {
  return Object.keys(connectedUsers);
}