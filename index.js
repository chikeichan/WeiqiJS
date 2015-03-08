var app     = require('./server/server.js');
var port    = process.env.PORT || 8080;
var io       = require('socket.io').listen(app.listen(port));

var players = {};
var weiqi = {};
var rooms = {};

io.on('connection',function(socket){
  socket.on('init',function(d){
    var roomName = socket.id.slice(0,6);
    var nsp = io.of('/'+roomName);
    rooms[roomName]         = {};
    rooms[roomName].players = {};
    rooms[roomName].weiqi   = {};

    socket.join('/'+roomName);
    io.to('/'+roomName).emit('room', roomName);
  })

  socket.on('joinGame',function(roomName){
    socket.join('/'+roomName);
    io.to('/'+roomName).emit('room',roomName);
    io.to('/'+roomName).emit('players',rooms[roomName].players);
    io.to('/'+roomName).emit('oppoMove',rooms[roomName].weiqi);
  })

  socket.on('join',function(attr){
    rooms[attr.room].players[attr.me] = socket.id;
    io.to('/'+attr.room).emit('players',rooms[attr.room].players);
  })

  socket.on('move',function(attr){
    rooms[attr.room].weiqi = attr;
    io.to('/'+attr.room).emit('oppoMove',attr);
  })

  socket.on('exit',function(attr){
    var players = rooms[attr.room].players;
    for(var key in players){
      if(players[key] === socket.id){
        delete players[key];
        io.to('/'+attr.room).emit('leave',socket.id)
        // socket.broadcast.emit('leave',socket.id);
      }
    }
  })

  socket.on('disconnect',function(){
  //   for(var key in players){
  //     if(players[key] === socket.id){
  //       delete players[key];
  //       socket.broadcast.emit('leave',socket.id);
  //     }
  //   }
  })
})

console.log('App listening at ', port);
