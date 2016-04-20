var Preload = function(game){};

Preload.prototype = {

	preload: function(){ 
		
		this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
		this.preloadBar.anchor.setTo(0.5);
		
		this.load.setPreloadSprite(this.preloadBar);
		
		
		this.game.load.spritesheet('dude', 'assets/maps/Neonman.png', 48, 96);
	    this.game.load.tilemap('tilemap', 'assets/maps/final_game.json', null, Phaser.Tilemap.TILED_JSON);
	    this.game.load.image('tile1', 'assets/maps/night.png');
		this.game.load.image('tile2', 'assets/maps/0_demo.png');
		this.game.load.image('tile4', 'assets/maps/splash.png');
		this.game.load.image('gameover', 'assets/maps/game_over.png');
		this.game.load.image('play', 'assets/maps/play.png');
		this.game.load.image('menu', 'assets/maps/menu.png');
		this.game.load.image('skull', 'assets/maps/1.png');
		this.game.load.image('enemy', 'assets/maps/ghost.png');
		this.game.load.image('flag', 'assets/maps/flag.png');
		this.game.load.image('gamewon', 'assets/maps/game_won.png');
		this.game.load.audio('skullsound', ['assets/audio/skullsound.ogg', 'assets/audio/skullsound.mp3']);
		this.game.load.audio('evil', 'assets/audio/evillaugh.ogg');
		this.game.load.audio('finish', 'assets/audio/well_done.ogg');
	},

	create: function(){
		this.game.state.start("Main");
	}
}