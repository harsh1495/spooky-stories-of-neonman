var GameTitle = function(game){};

GameTitle.prototype = {

	create: function(){
		this.startGame();
	},

	startGame: function(){
		this.game.state.start("Main");
	}

}