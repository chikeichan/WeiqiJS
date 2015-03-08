var socket;
var game;
function startGame(room){
	//Create SVG
	var svg = d3.select('#game-board').append('svg')
							.attr('width',boardWidth)
							.attr('height',boardWidth);


	//Initialize Game
	game = new GameModel();
	var gameView = new GameView({model: game, el: 'svg'});
	var joinView = new JoinView({model: game, el: 'div#join-button'});

	//Configures Sockets
	socket = Multiplayer({
		model: game,
		room: room,
		onInit: function(existingPlayers){
			game.set('players', existingPlayers);
			// renderUI(existingPlayers);
			joinView.render();
		},
		onLeave: function(id){
			var players = game.get('players');
			for(var key in players){
				if(players[key] === id){
					delete players[key];
				}
			}	
			game.set('players', players);
			joinView.render();
		},
		onMove: function(newState){
			if(newState.board){		
				game.set('board', newState.board);
				game.set('currentPlay', newState.currentPlay);
				game.set('lastKills', newState.lastKills);
				game.set('lastPlay', newState.lastPlay);
			}
		},
		onJoin: function(room){
			game.set('room',room);
		}
	});

	//Add key event listeners
	$(document).ready(function(){
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
			}
		});
	});

	window.onbeforeunload = function(){
		socket.emit('exit',game.attributes);
	}
}
