function Multiplayer(attr){
  var socket = io();

  socket.emit('init', 'connected');

  socket.on('players',function(players){
    attr.onInit(players);
  });

  socket.on('oppoMove',function(newState){
    attr.onMove(newState);
  })

  socket.on('leave',function(id){
    attr.onLeave(id);
  })

  return socket;
}
