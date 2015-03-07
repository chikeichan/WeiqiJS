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
var socket = Multiplayer({
	model: weiqi,
	onInit: function(existingPlayers){
		players = existingPlayers;
		renderUI(players);
	},
	onLeave: function(id){
		for(var key in players){
			if(players[key] === id){
				delete players[key];
			}
		}	
		renderUI(players);
	},
	onMove: function(newState){
		if(newState.board){		
			weiqi.board = newState.board;
			weiqi.currentPlay = newState.currentPlay;
			weiqi.lastKills = newState.lastKills;
			weiqi.lastPlay = newState.lastPlay;
		}
		render(svg, weiqi);		
	}
});





//Instantiate game
var weiqi;
$(document).ready(function(){
	// $('.init').width(boardWidth+1);
	// $('.init').height(boardWidth+1);

	$('body').on('keydown',function(e){
		// console.log(e.keyCode)
		if(e.keyCode === 66){
			weiqi.currentPlay = 'black';
		}
		if(e.keyCode === 87){
			weiqi.currentPlay = 'white';
		}
		if(e.keyCode === 90){
			weiqi.undo();
			render(svg,weiqi);
		}
	});

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
		player = Player({color: 'white'});
		socket.emit('join',player)
	});

	$('#player-join-black').on('click',function(){
		player = Player({color: 'black'});
		socket.emit('join',player)
	})

})


