//Create SVG
var svg = d3.select('body').append('svg')
						.attr('width',boardWidth)
						.attr('height',boardWidth);


//Initialize Game
var game = new GameModel();
var gameView = new GameView({model: game, el: 'svg'});

$('.init').remove();

//Configures Sockets
var socket = Multiplayer({
	model: game,
	onInit: function(existingPlayers){
		game.set('players', existingPlayers);
		renderUI(existingPlayers);
	},
	onLeave: function(id){
		var players = game.get('players');
		for(var key in players){
			if(players[key] === id){
				delete players[key];
			}
		}	
		game.set('players', players);
		renderUI(players);
	},
	onMove: function(newState){
		if(newState.board){		
			game.set('board', newState.board);
			game.set('currentPlay', newState.currentPlay);
			game.set('lastKills', newState.lastKills);
			game.set('lastPlay', newState.lastPlay);
		}
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

	$('#player-join-white').on('click',function(){
		game.set('me', 'white');
		socket.emit('join',game.get('me'))
	});

	$('#player-join-black').on('click',function(){
		game.set('me', 'black')
		socket.emit('join', game.get('me'))
	})

})

//Render Interface
function renderUI(players){
	$('#player-join-white').show();
	$('#player-join-black').show();
	$('#player-id-white').text('');
	$('#player-id-black').text('');

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

	if(game.get('me')){
		$('#player-join-white').hide();
		$('#player-join-black').hide();		
	}
};
