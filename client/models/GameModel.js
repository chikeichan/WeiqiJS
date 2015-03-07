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
    this.set('history', []);
  },

  //put stones on the board
  putStone : function(coor){
    var history = this.get('history');
    history.push(JSON.stringify(this.get('board')));
    this.set('history', history);

    var board = this.get('board');
    board[coor].color = this.get('currentPlay');
    this.set('board', board)
    // this.get('board')[coor].color = this.get('currentPlay');
    this.evaluateEdge(coor,this.get('currentPlay'));
    this.findKills(coor);
    if(!this.findLife(coor)){
      this.removeStone(coor);
      return;
    }
    var temp = this.get('currentPlay') === 'black' ? 'white' : 'black';
    this.set('currentPlay', temp);

    var lastPlay = this.get('lastPlay');
    lastPlay[this.get('board')[coor].color] = coor;
    this.set('lastPlay', lastPlay);
    socket.emit('move', this.attributes);
  },

  //Remoev Stone on board
  removeStone : function(coor){
    var board = this.get('board');
    board[coor].color = null;
    for(var edge in board[coor].edges){
      board[coor].edges[edge].color = board[edge].color;
      board[edge].edges[coor] = 'open';
    }
  },

  undo : function(doNotPush){
    if(this.get('history').length > 0){
      var move = this.get('history').pop();
      this.set('board', JSON.parse(move));
      var currentPlay = this.get('currentPlay') === 'black' ? 'black' : 'white';
      this.set('currentPlay', currentPlay);
    }
  },

  //Set edge to true if connected to same stones
  evaluateEdge : function(coor,stone){
    var board = this.get('board');
    for(var edge in board[coor].edges) {
      if(board[edge].color === stone){
        board[coor].edges[edge] = true;
        board[edge].edges[coor] = true;
      } else if(board[edge].color !== stone && !!board[edge].color) {
        board[coor].edges[edge] = false;
        board[edge].edges[coor] = false;
      } else {
        board[edge].edges[coor] = board[coor].color;
      }
    }
  },

  //Find kills
  findKills : function(coor){
    //Previous Kills of opponents
    var otherColor = this.get('currentPlay') === 'black' ? 'white' : 'black';
    var prevKilled = this.get('lastKills')[otherColor];
    var undo = false;
    var killed = false;
    var board = this.get('board');
    for(var edge in board[coor].edges){
      if(board[edge].color !== board[coor].color && !!board[edge].color){
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
          var lastKills = this.get('lastKills');
          // console.log(this)
          lastKills[board[coor].color] = kills;
          this.set('lastKills', lastKills);

          killed = true;
        }
      }
    }
    if(!killed){
      var lastKills = this.get('lastKills');
      lastKills[board[coor].color] = undefined;
      this.set('lastKills', lastKills);
      // this.set('lastKills')[board[coor].color] = undefined;
    }
    if(undo){
      this.undo();
    }
  },

  //Find Group
  findGroup : function(coor){
    var result = {}
        result[coor] = true;
    var board = this.get('board');
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
    var board = this.get('board');
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








