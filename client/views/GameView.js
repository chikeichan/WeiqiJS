//board metrics
var boardWidth = window.innerHeight*0.9 > window.innerWidth*0.9 ? window.innerWidth*0.9 : window.innerHeight*0.9;
var boardSize = 19;
var stoneRadius = ((boardWidth/boardSize)/2)-2;
var step = boardWidth/boardSize;
var init = step/2;
var end = (boardSize-1)*step+init;

var GameView = Backbone.View.extend({
  initialize : function(){
    this.model.on('change',this.render,this); 
    this.model.on('change:room',function(){
      document.title = this.model.get('room');
    },this)   
    this.render();
  },
  //Get stones ready for D3
  getStones : function(){
    var stones = [];
    var board = this.model.get('board')
    for(var key in board){
      var row = key.charCodeAt(0)-65;
      var col = +key.slice(1);
      var stone = board[key];
      stones.push({cx: step*row+init, cy: step*col+init, stone: stone.color, coor: key, value: stone.value})
    }
    return stones;
  },
  //Get grids ready for D3
  getGrid : function(){
    var results = [];

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
    var grids = d3.select(this.el).selectAll('circle').data(this.getStones());
    var gameView = this;

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
        if(!d.stone && gameView.model.get('me')){ 
          $(this).attr({
            fill: gameView.model.get('me'),
            opacity: 0.5
        });
        }
      })
      .on('mouseleave', function(d){
        gameView.render();
      })
      .on('click',function(d){
        if(!d.stone && gameView.model.get('me') === gameView.model.get('currentPlay')){  
          gameView.model.putStone(d.coor);
        }
      })

    $('#current-turn').text(gameView.model.currentPlay);
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
  }
})