var app     = require('./server/server.js');
var port    = process.env.PORT || 8080;
var io       = require('socket.io').listen(app.listen(port));

var players = {};
var weiqi = {};

io.on('connection',function(socket){
  socket.on('init',function(d){
    socket.emit('players',players);
    socket.emit('oppoMove', weiqi);
  })

  socket.on('join',function(player){
    players[player] = socket.id;
    socket.broadcast.emit('players',players);
    socket.emit('players',players);
  })

  socket.on('move',function(newState){
    weiqi = newState;
    socket.broadcast.emit('oppoMove', newState);
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