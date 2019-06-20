let express = require('express');
let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.use(express.static('public'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  let nickName;
  socket.on('come in', (name) => {
    nickName = name;
    socket.broadcast.emit('display come in', name);
  });

  socket.on('typing', data => {
    socket.broadcast.emit('someone typing', data);
  });

  socket.on('no typing', () => {
    socket.broadcast.emit('no one typing');
  });

  socket.on('chat message', function(name, msg){
    socket.broadcast.emit('display chat message', name, msg);
    socket.broadcast.emit('no one typing');
  });
  console.log('conected');
  socket.on('disconnect', (reason) => {
    io.emit('leave', nickName);
    console.log(nickName + ' leave');
  });
});

http.listen(3000, function () {
  console.log('listening on *:3000');
});