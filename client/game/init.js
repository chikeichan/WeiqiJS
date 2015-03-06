//board metrics
var boardWidth = $(document).height()*0.9 > $(document).width()*0.9 ? $(document).width()*0.9 : $(document).height()*0.9;
var boardSize = 19;
var stoneRadius = ((boardWidth/boardSize)/2)-2;

//Create SVG
var svg = d3.select('body').append('svg')
						.attr('width',boardWidth)
						.attr('height',boardWidth);

//Players
var player;
var players = {};

//Initialize Game
$('.init').width(boardWidth+1);
$('.init').height(boardWidth+1);
boardSize = $('#board-size').val();
weiqi = Weiqi(boardSize,boardWidth);
stoneRadius = ((boardWidth/boardSize)/2)-2;
render(svg, weiqi);
$('.init').remove();

//Sockets
var socket = Multiplayer(weiqi, function(existingPlayers){
	players = existingPlayers;
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
}, function(id){
	console.log(id,players);
	for(var key in players){
		if(players[key] === id){
			delete players[key];
			var dom = '#player-join-'+key;
			$(dom).show();
		}
	}	
});




//Instantiate game
var weiqi;
$(document).ready(function(){
	// $('.init').width(boardWidth+1);
	// $('.init').height(boardWidth+1);

	// $('body').on('keydown',function(e){
	// 	// console.log(e.keyCode)
	// 	if(e.keyCode === 66){
	// 		weiqi.currentPlay = 'black';
	// 	}
	// 	if(e.keyCode === 87){
	// 		weiqi.currentPlay = 'white';
	// 	}
	// 	if(e.keyCode === 90){
	// 		weiqi.undo();
	// 		render(svg,weiqi);
	// 	}
	// });

	// $('#board-size').on('keydown',function(e){
	// 	if(e.keyCode === 13){
	// 		boardSize = $(this).val();
	// 		weiqi = Weiqi(boardSize,boardWidth);
	// 		stoneRadius = ((boardWidth/boardSize)/2)-2;
	// 		render(svg, weiqi);
	// 		$('.init').remove();
	// 	}
	// });

	// $('#init').on('click',function(e){
	// 	boardSize = $('#board-size').val();
	// 	weiqi = Weiqi(boardSize,boardWidth);
	// 	Multiplayer(weiqi);
	// 	stoneRadius = ((boardWidth/boardSize)/2)-2;
	// 	render(svg, weiqi);
	// 	$('.init').remove();
	// });

	$('#player-join-white').on('click',function(){
		player = Player({
			color: 'white'
		});

		socket.emit('join',player)

		$(this).hide();
		$('#player-join-black').hide();

	});

	$('#player-join-black').on('click',function(){
		player = Player({
			color: 'black'
		});

		socket.emit('join',player)

		$(this).hide();
		$('#player-join-white').hide();
	})

})

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
			if(!d.stone && player.color === weiqi.currentPlay){	
				game.putStone(d.coor);
				socket.emit('move',{coor: d.coor, color: player.color})
				render(svg,game);
			}
		})

		renderValues(svg,game);
}

function renderValues(svg,game){
	var dev = svg.selectAll('text').data(game.getStones());

	//Initialize board
	dev.enter().append('text')

	//Updates attributes
	dev.attr('x',function(d){return d.cx})
		.attr('y',function(d){return d.cy})
		.attr('r',stoneRadius)
		.attr('fill','red')
		.attr('font-size',stoneRadius)
		.text(function(d){if(d.value!==0){return d.value}})

}
