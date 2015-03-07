
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
// var players = {};

//Initialize Game
var game = new GameModel();
var gameView = new GameView({model: game, el: 'svg'});
// $('.init').width(boardWidth+1);
// $('.init').height(boardWidth+1);
// boardSize = $('#board-size').val();
// weiqi = Weiqi(boardSize,boardWidth);
// render(svg, weiqi);
$('.init').remove();

//Sockets
// var socket = Multiplayer({
// 	model: weiqi,
// 	onInit: function(existingPlayers){
// 		players = existingPlayers;
// 		renderUI(players);
// 	},
// 	onLeave: function(id){
// 		for(var key in players){
// 			if(players[key] === id){
// 				delete players[key];
// 			}
// 		}	
// 		renderUI(players);
// 	},
// 	onMove: function(newState){
// 		if(newState.board){		
// 			weiqi.board = newState.board;
// 			weiqi.currentPlay = newState.currentPlay;
// 			weiqi.lastKills = newState.lastKills;
// 			weiqi.lastPlay = newState.lastPlay;
// 		}
// 		render(svg, weiqi);		
// 	}
// });





//Instantiate game
// var weiqi;
$(document).ready(function(){
	// $('.init').width(boardWidth+1);
	// $('.init').height(boardWidth+1);

	$('body').on('keydown',function(e){
		// console.log(e.keyCode)
		if(e.keyCode === 66){
			game.set('currentPlay', 'black');
		}
		if(e.keyCode === 87){
			game.set('currentPlay', 'white');
		}
		if(e.keyCode === 90){
			game.undo();
			gameView.render();
		}
	});

	$('#player-join-white').on('click',function(){
		// player = Player({color: 'white'});
		game.set('me', 'white');
		// socket.emit('join',player)
	});

	$('#player-join-black').on('click',function(){
		// player = Player({color: 'black'});
		game.set('me', 'black')
		// socket.emit('join',player)
	})

})


