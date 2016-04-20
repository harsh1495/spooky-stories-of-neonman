var GameWon = function(game){};

GameWon.prototype = {

  	create: function(){
		
		this.game.stage.backgroundColor = "#000000";

		this.gamewontitle = this.game.add.sprite(512, 400, 'gamewon');
		this.gamewontitle.anchor.setTo(0.5, 0.5);
		
		var playButton = this.game.add.button(400, 550, "play", this.playAgain, this);
		playButton.anchor.setTo(0.5, 0.5);
		
		var menuButton = this.game.add.button(606, 550, "menu", this.menu, this);
		menuButton.anchor.setTo(0.5, 0.5);
	},

	playAgain: function(){
		this.game.state.start("GameTitle");
	},
	
	menu: function(){
		
		window.location = "/Final_Game/index.html"; 
	}
	
}