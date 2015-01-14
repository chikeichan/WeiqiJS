//
var ai = {};

//main function
ai.play = function(svg,game){
	this.forceField(game.board);
};

//Adds Gravity
ai.forceField = function(board){
	for (var stone in board){
		if(board[stone].color === 'black'){
			console.log(board[stone])
		}
	}
};