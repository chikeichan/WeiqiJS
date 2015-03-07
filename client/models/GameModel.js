var GameModel = Backbone.Model.extend({
  //initialize the game
  initialize : function(){
    this.set('players', {})
    this.set('board', createBoard(19));
    this.set('currentPlay', 'black');
    this.set('lastPlay', {
      white: '',
      black: ''
    });
    this.set('lastKills', {
      white: undefined,
      black: undefined
    });
  },

  //put stones on the board
  putStone : function(coor){
    this.board[coor].color = this.currentPlay;
    this.evaluateEdge(coor,this.currentPlay);
    this.findKills(coor);
    if(!this.findLife(coor)){
      this.removeStone(coor);
      return;
    }
    this.currentPlay = this.currentPlay === 'black' ? 'white' : 'black';
    this.lastPlay[this.board[coor].color] = coor;
  },

  //Remoev Stone on board
  removeStone : function(coor){
    this.board[coor].color = null;
    for(var edge in this.board[coor].edges){
      this.board[coor].edges[edge].color = this.board[edge].color;
      this.board[edge].edges[coor] = 'open';
    }
  },

  //Set edge to true if connected to same stones
  evaluateEdge : function(coor,stone){
    for(var edge in this.board[coor].edges) {
      if(this.board[edge].color === stone){
        this.board[coor].edges[edge] = true;
        this.board[edge].edges[coor] = true;
      } else if(this.board[edge].color !== stone && !!this.board[edge].color) {
        this.board[coor].edges[edge] = false;
        this.board[edge].edges[coor] = false;
      } else {
        this.board[edge].edges[coor] = this.board[coor].color;
      }
    }
  },

  //Find kills
  findKills : function(coor){
    //Previous Kills of opponents
    var otherColor = this.currentPlay === 'black' ? 'white' : 'black';
    var prevKilled = this.lastKills[otherColor];
    var undo = false;
    var killed = false;
    for(var edge in this.board[coor].edges){
      if(this.board[edge].color !== this.board[coor].color && !!this.board[edge].color){
        if(!this.findLife(edge)){
          var kills = [];
          for(var stone in this.findGroup(edge)){
            kills.push(stone);
            this.removeStone(stone);
          }
          if(prevKilled!==undefined){
            if(kills.length === 1 && prevKilled[0] === coor){
              undo = true;
            }
          }
          this.lastKills[this.board[coor].color] = kills;
          killed = true;
        }
      }
    }
    if(!killed){
      this.lastKills[this.board[coor].color] = undefined;
    }
    if(undo){
      this.undo();
    }
  },

  //Find Group
  findGroup : function(coor){
    var result = {}
        result[coor] = true;
    var board = this.board;
    var path = {};

    var recurse = function(coor){
      for (var edge in board[coor].edges){
        if(board[edge].color === board[coor].color && !result[edge]){
          result[edge] = true;
          recurse(edge);
        }
      }
    }
    recurse(coor);
    return result;
  },

  //Find life for group
  findLife : function(coor){
    var board = this.board;
    var result = false;
    var path = {}
    var recurse = function(coor){
      for(var edge in board[coor].edges){
        if(board[coor].edges[edge] === 'open'){
          result = true;
          return;
        } else if(!!board[coor].edges[edge] && !path[edge]){
          path[edge] = true;
          recurse(edge);
        }
      }
    }
    recurse(coor);
    return result;
  }

})


//Utilities funcitons ===================
function createBoard(boardSize){
  var board = {};
  for (var i = 0; i<boardSize; i++){
    for (var j = 0; j<boardSize; j++){
      var row = String.fromCharCode(65+i);
      var col = j;
      board[row+col] = {
        value: 0,
        color: null,
        edges: createEdge(i,j)
      }
    }
  }
  // history.push(JSON.stringify(board))
  return board;
}

function createEdge(i,j){
  var up = String.fromCharCode(65+i)+(j-1);
  var down = String.fromCharCode(65+i)+(j+1);
  var left = String.fromCharCode(65+i-1)+(j);
  var right = String.fromCharCode(65+i+1)+(j);

  var edge = {};

  if(j>0){
    edge[up] = 'open';
  }
  if(j<18){
    edge[down] = 'open';
  }
  if(i>0){
    edge[left] = 'open';
  }
  if(i<18){
    edge[right] = 'open';
  }
  return edge;
}








