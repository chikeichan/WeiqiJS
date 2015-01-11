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
				board[row+col] = {
					color: 'rgb(94, 56, 24)'
				}
			}
		}
		return board;
	}

	weiqi.board = createBoard(n);

	weiqi.getStones = function(){
		var colors = ['','black','white']
		var stones = [];
		for(var key in this.board){
			var row = key.charCodeAt(0)-65;
			var col = +key.slice(1);
			var stone = this.board[key];
			stones.push({cx: step*row+init, cy: step*col+init, stone: stone.color, coor: key})
		}
		return stones;
	}

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

	return weiqi;
}



var boardWidth = $(document).height()*0.9 > $(document).width()*0.9 ? $(document).width()*0.9 : $(document).height()*0.9;
var boardSize = 10;
var stoneRadius = ((boardWidth/boardSize)/2)-2;

var svg = d3.select('body').append('svg')
						.attr('width',boardWidth)
						.attr('height',boardWidth);

var weiqi = Weiqi(boardSize,svg,boardWidth);

var drawBoard = function(svg){
	svg.selectAll('line').data(weiqi.getGrid())
			.enter().append('line')
			.attr('x1', function(d){return d.x1})
			.attr('x2', function(d){return d.x2})
			.attr('y1', function(d){return d.y1})
			.attr('y2', function(d){return d.y2})
			.attr('stroke-width', stoneRadius/10)
			.attr('stroke','black')
}

var render = function(svg){
	svg.selectAll('circle').data(weiqi.getStones())
			.enter().append('circle')
			.attr('cx',function(d){return d.cx})
			.attr('cy',function(d){return d.cy})
			.attr('r',stoneRadius)
			.attr('fill',function(d){return d.stone})
			.on('mouseenter',function(d){$(this).attr('fill','black')})
			.on('mouseleave', function(d){$(this).attr('fill','rgb(94, 56, 24)')})
			.on('click',function(d){console.log(d)})
	drawBoard(svg);
}

render(svg);