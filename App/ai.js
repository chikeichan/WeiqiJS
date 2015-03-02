//
var ai = {};

//main function
ai.play = function(svg,game,last){
	this.forceField(game,last);
};

//Adds Gravity
ai.forceField = function(game,last){
	var hist = {};
	var board = game.board;
	var queue = [];
	var breath = [];


	var addValue = function(coor,steps){
		if(steps > 0){
			if(!hist[coor]){
				if(board[coor].value < 5){
					if(game.currentPlay === 'white'){
						board[coor].value += steps;
					} else {
						board[coor].value -= steps;				
					}
					hist[coor] = steps;
				}
			}

			for(var edge in board[coor].edges){
				queue.push(edge);
				breath.push(steps-1);
			}
		}
		if(queue.length>0){	
			addValue(queue.shift(),breath.shift())
		}
	}
	addValue(last.coor,4);
};