var boardWidth = $(document).height()*0.9 > $(document).width()*0.9 ? $(document).width()*0.9 : $(document).height()*0.9;
var boardSize = 6;
var stoneRadius = ((boardWidth/boardSize)/2)-2;

var svg = d3.select('body').append('svg')
						.attr('width',boardWidth)
						.attr('height',boardWidth);

var weiqi = Weiqi(boardSize,boardWidth);

var drawBoard = function(svg, game){
	svg.selectAll('line').data(game.getGrid())
		.enter().append('line')
		.attr('x1', function(d){return d.x1})
		.attr('x2', function(d){return d.x2})
		.attr('y1', function(d){return d.y1})
		.attr('y2', function(d){return d.y2})
		.attr('stroke-width', stoneRadius/10)
		.attr('stroke','grey')
}

var render = function(svg,game){
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
				$(this).attr('opacity',100);
			}
			return d.stone;
		})
		.on('mouseenter',function(d){
			$(this).attr({
				fill: game.currentPlay,
				opacity: 100
			});
		})
		.on('mouseleave', function(d){
			render(svg,game);
		})
		.on('click',function(d){
			game.putStone(d.coor);
			render(svg,game);
		})
}

render(svg, weiqi);