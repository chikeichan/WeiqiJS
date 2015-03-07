var GameView = Backbone.View.extend({

  //initialize
  initialize : function(){
    // this.svg = svg;
    this.render();
  },
  getStones : function(){
    var stones = [];
    var size = $(document).height()*0.9 > $(document).width()*0.9 ? $(document).width()*0.9 : $(document).height()*0.9;

    for(var key in this.model.board){
      var row = key.charCodeAt(0)-65;
      var col = +key.slice(1);
      var stone = this.model.board[key];
      stones.push({cx: size/19*row+size/38, cy: size/19*col+size/38, stone: stone.color, coor: key, value: stone.value})
    }
    return stones;
  },

  getGrid : function(){
    var results = [];
    var size = $(document).height()*0.9 > $(document).width()*0.9 ? $(document).width()*0.9 : $(document).height()*0.9;
    var step = size/19
    var init = size/38
    // var start = window.innerWidth/38;
    var end = (19-1)*step+init;

    for(var i = 0; i < 19; i++){
      var vertData = {
        x1: i*step+init,
        y1: init,
        x2: i*step+init,
        y2: end
      };
      var horiData = {
        y1: i*step+init,
        x1: init,
        y2: i*step+init,
        x2: end
      };
      results.push(vertData);
      results.push(horiData);
    }
    return results;
  },

  render : function(){
    this.getStones();
    var grids = d3.select(this.el).selectAll('circle').data(this.getStones());
    //Draw grid
    this.drawBoard();

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
            fill: this.model.player.color,
            opacity: 0.5
        });
        }
      })
      .on('mouseleave', function(d){
        render();
      })
      .on('click',function(d){
        if(!d.stone && this.model.player.color === this.model.currentPlay){  
          this.model.putStone(d.coor);
          socket.emit('move',game);
          render();
        }
      })

    $('#current-turn').text(this.model.currentPlay);

  },

//function to draw board
  drawBoard : function(){
    d3.select(this.el).selectAll('line').data(this.getGrid())
      .enter().append('line')
      .attr('x1', function(d){return d.x1})
      .attr('x2', function(d){return d.x2})
      .attr('y1', function(d){return d.y1})
      .attr('y2', function(d){return d.y2})
      .attr('stroke-width', stoneRadius/15)
      .attr('stroke','black')
  },

  //Render Interface
  renderUI : function(players){
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

    if(this.model.player){
      $('#player-join-white').hide();
      $('#player-join-black').hide();   
    }
  }
})