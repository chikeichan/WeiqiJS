//UTITLIES FUNCTIONS =================================================
//function to draw board
function drawBoard(svg, game){
  svg.selectAll('line').data(game.getGrid())
    .enter().append('line')
    .attr('x1', function(d){return d.x1})
    .attr('x2', function(d){return d.x2})
    .attr('y1', function(d){return d.y1})
    .attr('y2', function(d){return d.y2})
    .attr('stroke-width', stoneRadius/15)
    .attr('stroke','black')
}

//Rendering Function
function render(svg,game){
  var grids = svg.selectAll('circle').data(game.getStones());
  //Draw grid
  drawBoard(svg,game);

  //Initialize board
  grids.enter().append('circle')

  //Updates attributes
  grids.attr('cx',function(d){return d.cx})
    .attr('cy',function(d){return d.cy})
    .attr('r',stoneRadius)
    .attr('fill',function(d){
      if(!d.stone){
        $(this).attr('opacity',0);
      } else {
        $(this).attr('opacity',1);
      }
      return d.stone;
    })
    .on('mouseenter',function(d){
      if(!d.stone){ 
        $(this).attr({
          fill: player.color,
          opacity: 0.5
      });
      }
    })
    .on('mouseleave', function(d){
      render(svg,game);
    })
    .on('click',function(d){
      if(!d.stone && player.color === game.currentPlay){  
        game.putStone(d.coor);
        socket.emit('move',game);
        render(svg,game);
      }
    })

  $('#current-turn').text(weiqi.currentPlay);

}

//Render Interface
function renderUI(players){
  $('#player-join-white').show();
  $('#player-join-black').show();
  $('#player-id-white').text('');
  $('#player-id-black').text('');

  for(var key in players){
    if(key === 'white'){
      $('#player-join-white').hide();
      $('#player-id-white').text(players[key])
    }
    if(key === 'black'){
      $('#player-join-black').hide();   
      $('#player-id-black').text(players[key])
    }
  }

  if(player){
    $('#player-join-white').hide();
    $('#player-join-black').hide();   
  }
};