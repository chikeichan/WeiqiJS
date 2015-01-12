var Weiqi = function(n,size){
	var weiqi = {};

	//Basic Metrics
	var step = size/n;
	var init = (size/n)/2;
	weiqi.board = createBoard(n);

	//Board Status
	weiqi.currentPlay = 'black';


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
		this.board[coor].color = this.currentPlay;
		this.currentPlay = this.currentPlay === 'black' ? 'white' : 'black';
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
					color: null
				}
			}
		}
		return board;
	}
}



