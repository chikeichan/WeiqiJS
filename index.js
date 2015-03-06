var app     = require('./server/server.js');
var port    = process.env.PORT || 8080;
var io       = require('socket.io').listen(app.listen(port));

var players = {};

io.on('connection',function(socket){
  socket.on('init',function(d){
    socket.emit('players',players)
  })
  socket.on('join',function(player){
    players[player.color] = socket.id;
  })
  socket.on('move',function(move){
    socket.broadcast.emit('oppoMove', move);
  })
  socket.on('disconnect',function(){
    for(var key in players){
      if(players[key] === socket.id){
        delete players[key];
        socket.broadcast.emit('leave',socket.id);
      }
    }
  })
})

console.log('App listening at ', port);