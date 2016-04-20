var Boot = function(game){

};
  
Boot.prototype = {

	preload: function(){
		//Adding the loading bar
		this.game.load.image('preloadbar', 'assets/maps/loading.png');

	},
	
  	create: function(){
		this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		
		this.scale.pageAlignHorizontally = true;
		this.scale.pageAlignVertically = true;
		
		this.game.state.start("Preload");
	}
}