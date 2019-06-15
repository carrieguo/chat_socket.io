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
    io.emit('display come in', name);
  });
  socket.on('chat message', function(name, msg){
    io.emit('display chat message', name, msg);
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