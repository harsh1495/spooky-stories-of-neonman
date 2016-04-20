var Main = function(game){
	

};

var score = 0;
var positions = [1088, 3872, 9504, 11936, 14400, 14976, 19648, 20416, 20992, 23456, 23712, 24000]  

Main.prototype = {

	create: function() {

		//Start the Arcade Physics systems
		this.game.physics.startSystem(Phaser.Physics.ARCADE);
		
		//Set the background colour of the game
		this.game.stage.backgroundColor = "#333333";
		
		//Add the tilemap and tileset image. 
	    this.map = this.game.add.tilemap('tilemap');
	    this.map.addTilesetImage('tileset1', 'tile1');
		this.map.addTilesetImage('tileset2', 'tile2');
		this.map.addTilesetImage('tileset4', 'tile4');
		this.map.addTilesetImage('tileset6', 'skull');

	    //Add all the layers of the game except the Object Layer
	    this.backgroundLayer = this.map.createLayer('TileLayer1');
	    this.treeLayer = this.map.createLayer('TileLayer2');
		this.bottomLayer = this.map.createLayer('TileLayer3');
		this.ledgeLayer = this.map.createLayer('TileLayer4');

	    //Set what tiles can collide so that you can use the collide function
	    this.map.setCollisionBetween(1, 800, true, 'TileLayer1');
		this.map.setCollisionBetween(1, 800, true, 'TileLayer2');
		this.map.setCollisionBetween(1, 800, true, 'TileLayer3');
		this.map.setCollisionBetween(1, 800, true, 'TileLayer4');
		
		//For the object layer
		this.createSkulls();

	    //Add the player, that is, NEONMAN, to the game and enable arcade physics on it
	    this.player = this.game.add.sprite(32, this.game.world.centerY, 'dude');
	    this.game.physics.arcade.enable(this.player);

	    //Change the world size to match the size of this layer
	    this.treeLayer.resizeWorld();
		this.backgroundLayer.resizeWorld();
		this.bottomLayer.resizeWorld();
		this.ledgeLayer.resizeWorld();

	    //Set physics on NEONMAN
		this.player.body.bounce.y = 0.4;
		this.player.body.gravity.y = 1200;
		this.player.body.gravity.x = 20;
		this.player.body.velocity.x = 300;
		this.player.body.collideWorldBounds = true;
		
		//Create a running animation for NEONMAN
		this.player.animations.add('left', [0,1,2,3], 10, true);
		this.player.animations.add('right', [5,6,7,8], 10, true);
		
		//Add the creepy enemy
		this.enemies = this.game.add.group();
		this.enemies.enableBody = true;
		this.game.physics.arcade.enable(this.enemies);
		
		for(var i = 0; i < 12; i++)
		{			
			this.enemy = this.enemies.create(positions[i], 0, 'enemy')
			this.enemy.body.bounce.y = 0.4;
			this.enemy.body.gravity.y = 500;
			this.enemy.body.collideWorldBounds = true;
			this.enemy.body.velocity.x = -4;
		}
		
		//Add the score
		this.scoreText = this.game.add.text(16, 16, 'Skullpoints: 0', { fontSize: '32px', fill: 'red' }); 
		this.scoreText.fixedToCamera = true;
		
		//Make the camera follow the sprite
	    this.game.camera.follow(this.player);

	    //Enable cursor keys to create some controls
	    this.cursors = this.game.input.keyboard.createCursorKeys();
		
		//Add the finishing point of the game
		this.flags = this.game.add.sprite(25344, 224, 'flag');
		this.flags.enableBody = true;
		this.game.physics.arcade.enable(this.flags);
		
		//Add audio to the game
		this.skullSound = this.game.add.audio('skullsound');
		this.evilSound = this.game.add.audio('evil');
		this.finishSound = this.game.add.audio('finish');

	},
	
	//Find objects in a Tiled layer that containt a property called "type" equal to a certain value
	findObjectsByType: function(type, map, layerName) {
    var result = new Array();
    map.objects[layerName].forEach(function(element){
      if(element.properties.type === type) {
			element.y -= map.tileHeight;
			result.push(element);
			}      
		});
    return result;
	},
  
  //Create the skulls from an object
	createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },

	update: function() {
		
		//Make NEONMAN collide with the layers that you want
		this.game.physics.arcade.collide(this.player, this.backgroundLayer);
		this.game.physics.arcade.collide(this.player, this.treeLayer, this.killPlayer, null, this);
		this.game.physics.arcade.collide(this.player, this.ledgeLayer);
		this.game.physics.arcade.collide(this.player, this.bottomLayer, this.killPlayer, null, this);
		
		//Make the ghost and flag collide with the layer
		this.game.physics.arcade.collide(this.enemies, this.backgroundLayer);
		this.game.physics.arcade.collide(this.enemies, this.ledgeLayer);
		this.game.physics.arcade.collide(this.player, this.ledgeLayer);
		this.game.physics.arcade.collide(this.player, this.enemies, this.playerHit, null, this);
		this.game.physics.arcade.collide(this.flags, this.backgroundLayer);
		
		this.game.physics.arcade.overlap(this.player, this.skulls, this.collectSkulls, null, this);
		this.game.physics.arcade.overlap(this.player, this.flags, this.gameComplete, null, this);


		this.player.body.velocity.x = 0;
		
		if (this.cursors.right.isDown)
		{
			// Move to the right
			this.player.body.velocity.x = 450;
			this.player.animations.play('right');
		}
		
		else if (this.cursors.left.isDown)
		{
			//Move to the left
			this.player.body.velocity.x = -450;
			this.player.animations.play('left');
		}
		
		else
		{
        //  Stand still
			this.player.animations.stop();
			this.player.frame = 4;
		}
    
		//  Jump if NEONMAN is touching the ground
		if (this.cursors.up.isDown && this.player.body.blocked.down)
		{
			this.player.body.velocity.y = -850;
		}
	    

	},

	killPlayer: function(){
		
			this.player.kill();
			this.gameOver();
	},
	
	collectSkulls: function(player, collectable){
		this.skullSound.play();
		collectable.destroy();
		
		score += 10;
		this.scoreText.text = 'Skullpoints: ' + score;

	},
	
	createSkulls: function(){
		this.skulls = this.game.add.group();
		this.skulls.enableBody = true;
		var result = this.findObjectsByType('skull', this.map, 'ObjectLayer');
		result.forEach(function(element){
		this.createFromTiledObject(element, this.skulls);
    }, this);
		
	},
	
	playerHit: function(player, enemy)
	{
		if(enemy.body.touching.up)
		{
			this.evilSound.play();
			enemy.kill();
		}
		
		else if(enemy.body.touching.left)
		{
			player.kill();
			this.gameOver();
	
		}
		
		else if(enemy.body.touching.down)
		{
			player.kill();
			this.gameOver();
		}
	},
	
	gameComplete: function(){
		this.finishSound.play();
		this.game.state.start("GameWon");
		
	},
	
	gameOver: function(){
		this.game.state.start("GameOver");
	},

};