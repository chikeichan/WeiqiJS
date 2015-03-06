function Multiplayer(weiqi, onInit, onLeave){
  var socket = io();

  socket.emit('init', 'connected');

  socket.on('players',function(players){
    onInit(players);
  });

  socket.on('oppoMove',function(move){
    weiqi.putStone(move.coor);
  })

  socket.on('leave',function(id){
    onLeave(id);
  })

  return socket;
}
