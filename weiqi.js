var Weiqi = function(n,svg,size){
	var weiqi = {};

	var step = size/n;
	var init = (size/n)/2;

	var createBoard = function(boardSize){
		var board = {};
		for (var i = 0; i<boardSize; i++){
			for (var j = 0; j<boardSize; j++){
				var row = String.fromCharCode(65+i);
				var col = j;
				board[row+col] = 0;
			}
		}
		return board;
	}

	weiqi.board = createBoard(n);

	weiqi.getStones = function(){
		var colors = ['','black','white']
		var stones = [];
		for(var stone in this.board){
			var row = stone.charCodeAt(0)-65;
			var col = +stone.slice(1);
			var stone = this.board[stone];
			stones.push({cx: step*row+init, cy: step*col+init, stone: colors[stone], coor: stone})
		}
		return stones;
	}

	return weiqi;
}

var boardWidth = 500;
var boardSize = 19;
var stoneRadius = ((boardWidth/boardSize)/2)-1;

var svg = d3.select('body').append('svg')
						.attr('width',boardWidth)
						.attr('height',boardWidth);


var weiqi = Weiqi(19,svg,500);

var render = function(){
	svg.selectAll('circle').data(weiqi.getStones())
			.enter().append('circle')
			.attr('cx',function(d){return d.cx})
			.attr('cy',function(d){return d.cy})
			.attr('r',stoneRadius)
			.attr('fill',function(d){return d.stone})
			.on('mouseenter',function(d){$(this).attr('fill','black')})
			.on('mouseleave', function(d){$(this).attr('fill','rgb(255,230,176)')})
			.on('click',function(d){d.stone = 'black'; console.log(weiqi.getStones())})
}

render();