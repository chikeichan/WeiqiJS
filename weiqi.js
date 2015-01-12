var Weiqi = function(n,size){
	var weiqi = {};

	//Basic Metrics
	var step = size/n;
	var init = (size/n)/2;
	var history = [];
	weiqi.board = createBoard(n);

	//Board Status
	weiqi.currentPlay = 'black';
	weiqi.lastPlay = {
		white: '',
		black: ''
	}

	weiqi.lastKills = {
		white: undefined,
		black: undefined
	}




	//Return array of stones info for D3
	weiqi.getStones = function(){
		var stones = [];
		for(var key in this.board){
			var row = key.charCodeAt(0)-65;
			var col = +key.slice(1);
			var stone = this.board[key];
			stones.push({cx: step*row+init, cy: step*col+init, stone: stone.color, coor: key})
		}
		return stones;
	}

	//Return array of grid info for D3
	weiqi.getGrid = function(){
		var results = [];
		var start = 0*step+init;
		var end = (n-1)*step+init;
		for(var i = 0; i < n; i++){
			var vertData = {
				x1: i*step+init,
				y1: start,
				x2: i*step+init,
				y2: end
			};
			var horiData = {
				y1: i*step+init,
				x1: start,
				y2: i*step+init,
				x2: end
			};
			results.push(vertData);
			results.push(horiData);
		}
		return results;
	}

	//Put Stone on board
	weiqi.putStone = function(coor){
			history.push(JSON.stringify(this.board));
			this.board[coor].color = this.currentPlay;
			this.evaluateEdge(coor,this.currentPlay);
			// if(!this.legal(coor)){
			// 	this.removeStone(coor);
			// 	return;
			// }
			this.findKills(coor);
			if(!this.findLife(coor)){
				this.removeStone(coor);
				return;
			}
			this.currentPlay = this.currentPlay === 'black' ? 'white' : 'black';
			this.lastPlay[this.board[coor].color] = coor;
			forward = [];
	}

	//Remoev Stone on board
	weiqi.removeStone = function(coor){
		this.board[coor].color = null;
		for(var edge in this.board[coor].edges){
			this.board[coor].edges[edge].color = this.board[edge].color;
			this.board[edge].edges[coor] = 'open';
		}
	}

	//undo move
	weiqi.undo = function(doNotPush){
		if(history.length > 0){
			var move = history.pop();
			this.board = JSON.parse(move);
			console.log(this.currentPlay)
			this.currentPlay = this.currentPlay === 'black' ? 'black' : 'white';
		}
	}

	//Set edge to true if connected to same stones
	weiqi.evaluateEdge = function(coor,stone){
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
	}

	//Find kills
	weiqi.findKills = function(coor){
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
						console.log(prevKilled)
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
	}

	//Find Group
	weiqi.findGroup = function(coor){
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
	}

	//Find life for group
	weiqi.findLife = function(coor){
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

	return weiqi;

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
		if(j<n-1){
			edge[down] = 'open';
		}
		if(i>0){
			edge[left] = 'open';
		}
		if(i<n-1){
			edge[right] = 'open';
		}
		return edge;
	}
}



