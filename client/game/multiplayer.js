function Multiplayer(attr){
  var socket = io();

  if(!attr.room){
    socket.emit('init', 'connected');
  } else {
    socket.emit('joinGame', attr.room);
  }

  socket.on('players',function(players){
    attr.onInit(players);
  });

  socket.on('oppoMove',function(newState){
    attr.onMove(newState);
  })

  socket.on('leave',function(id){
    attr.onLeave(id);
  })

  socket.on('room',function(room){
    attr.onJoin(room);
  })

  return socket;
}
