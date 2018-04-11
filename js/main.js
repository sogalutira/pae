var Main = function() {};

//This sets the variable for the spacebar.
var spaceKey;
var leftKey;
var rightKey;
var upKey;

var background;
var ground;
var player;
var obstacle;
var enemyIsDead = false;
var isAlive = true;
var wall;
var self;

var fireball;
var obstacleFaceLeft = false;

var wallTimer;

var OPENING = 200;
var SPEED = 400;


//This sets the score to start at -1
var score = 0;

var GAME_WIDTH = 800;
var GAME_HEIGHT = 600;
var GAME_CONTAINER_ID = 'gameDiv';
var INITIAL_MOVESPEED = 10;
var SPAWN_RATE = 1.25;

//Create randomized integer variables
var bottomWallSize = (Math.random() * (1.200 - 0.0200) + 0.0300).toFixed(4);
var topWallSize = 1.3 - bottomWallSize;
var topWallLocation = 600 - topWallSize;

Main.prototype = {

//This is the object which runs the game.
preload: function(){

  game.load.image('background', 'assets/koolau.png');
  // game.load.image('player', 'assets/player.png');
  game.load.spritesheet('player', 'assets/pae.png', 197.5, 250);
  game.load.image('ground', 'assets/wallHorizontal.png');
  game.load.image('obstacle', 'assets/wallVertical.png');
  game.load.image('bullet', 'assets/enemy.png');
},

create: function(){
  background = game.add.tileSprite(0, 0, GAME_WIDTH, GAME_HEIGHT, 'background');

  game.physics.startSystem(Phaser.Physics.ARCADE);

  wallTimer = game.time.events.loop(Phaser.Timer.SECOND * SPAWN_RATE, this.spawnObstacles, this);

  fireballs = game.add.group();
  game.physics.enable(fireballs, Phaser.Physics.ARCADE);

  //Sets background color
  game.stage.backgroundColor = '#3498db';

  //Player
  player = game.add.sprite(GAME_WIDTH/8, GAME_HEIGHT*(3/8), 'player');
  player.scale.setTo(1, 1);
  player.anchor.set(0.5, 0.5);
  // game.physics.arcade.enable(player);
  game.physics.enable(player);
  player.animations.add('right', [0, 1], 2, true);
  player.animations.play('right');

  // spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
  leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
  rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
  upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);

  // upKey.onDown.add(function(){
  //   this.jump();
  // });


  //Player physics for gravity
  // player.body.bounce.y = 0.2;
  game.physics.arcade.gravity.y = 1200;

  obstacle = game.add.group();
  walls = game.add.group();
  game.physics.enable(obstacle);
  obstacleFaceLeft = true;


  //Sets up a group to call platforms so that we can call horizontal surfaces to this group
  platforms = game.add.group();
  platforms.enableBody = true;

  //Creates the ground which is a solid object that the player will not pass through
  ground = platforms.create(0, GAME_HEIGHT, 'ground');
  ground.anchor.setTo(0, 1);
  ground.scale.setTo(4, 1);
  game.physics.arcade.enable(ground);
  ground.body.immovable = true;
  ground.body.allowGravity = false;

  scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

},

update: function(){
  game.physics.arcade.collide(player, ground);
  game.physics.arcade.collide(fireballs, ground);

  background.tilePosition.x -= 1;

  this.handleCollisions();
  this.handleInput();
  // enemyShoots();

  walls.forEachAlive(function (obj) {
    if (obj.x + obj.width < game.world.bounds.left) {
      obj.kill();
    } else if (!obj.scored && obj.x <= player.x){
      Main.prototype.addScore(obj);
    }
  })
  
},

move: function(direction){
  player.body.velocity.x = direction * 200;
  if (player.body.velocity.x < 0) {
        player.scale.x = -1;
    }
    else if (player.body.velocity.x > 0) {
        player.scale.x = 1;
    }
},

spawnObstacle: function(y){
  wall = walls.create(game.width, y + OPENING / 2, 'obstacle')
  // wall = game.add.sprite(game.width, y + OPENING / 2, 'obstacle');
  game.physics.arcade.enableBody(wall);
  wall.body.allowGravity = false;
  wall.scored = false;
  wall.body.immovable = true;
  wall.body.velocity.x = -SPEED;
  return wall;
},

spawnObstacles: function(){
  var wallY = game.rnd.integerInRange(GAME_HEIGHT * .5, GAME_HEIGHT * .6);
  this.spawnObstacle(wallY);
},

addScore: function(wall){
  wall.scored = true;
  score++;
  scoreText.text = 'score: ' + score;
},

handleInput: function(){
  if (upKey.isDown && player.body.touching.down){
    player.body.velocity.y = -800;
  }
  if (leftKey.isDown){
    this.move(-1);
  }else if (rightKey.isDown){
    this.move(1);
  }else{
    this.move(0);
  }
},

jump: function(){
  var canJump = player.body.touching.down;
  //Ensures player is on the ground
  if (canJump) {
    player.body.velocity.y = -800;
  }
  return canJump;
},

handleCollisions: function() {
  // game.physics.arcade.overlap(player, wall, onPlayerVsEnemy, null, this);
  // (game.physics.arcade.collide(fireballs, player, playerDies, null, this)
  if (game.physics.arcade.collide(player, walls, this.playerDies, null, this)){
    scoreText = game.add.text(350,200, 'GAME OVER', {fill: '#ff0000'});
    // fireball.kill();
    wall.kill();
    player.kill();
    isAlive = false;
    walls.forEachAlive(function(wall){ 
      wall.body.velocity.x = wall.body.velocity.y = 0;
    })
    wallTimer.timer.stop();
  }
},

// function onPlayerVsEnemy(player, enemy){
//   if (player.body.velocity.y > 0) {
//     player.body.velocity.y = -200;
//     // die(enemy);
//   }else {
//     scoreText = game.add.text(350,200, 'You Lose!', {fill: '#ff0000'});
//     fireball.kill();
//     wall.kill();
//     player.kill();
//     // game.state.restart();
//   }
// }

// function die(enemy){
//   enemy.body.enable = false;
//   enemy.kill();
//   enemyIsDead = true;
//   score++;
//   scoreText.text = 'score: ' + score;
// }

// var shotTimerEnemy = 0;
// function enemyShoots() {
//   if (shotTimerEnemy < game.time.now){
//     shotTimerEnemy = game.time.now + 3000;
//     if (obstacleFaceLeft === true){
//       fireball = fireballs.create(walls.x + walls.width / 2 - 40, walls.y + walls.height / 2 + 5, 'bullet');
//     }
//     walls.velocity = -100;
//     // fireball.enableBody = true;
//     // fireball.physicsBodyType =  Phaser.Physics.ARCADE;
//     game.physics.enable(fireball, Phaser.Physics.ARCADE);
//     fireball.body.gravity.y = 500;
//     // fireball.body.bounce.y = 1;
//     fireball.anchor.setTo(1, 1);
//     fireball.outOfBoundsKill = true;
//     fireball.checkWorldBounds = true;
//     fireball.body.velocity.y = 0;
//     if (obstacleFaceLeft === true){
//       fireball.body.velocity.x = -500;
//     }
//   }
// }

playerDies: function(){
  player.kill();
}


}

// var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv', { preload: preload, create: create, update: update });

// game.state.start();

var game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.CANVAS, 'gameDiv', {create: function(){
    game.state.add('Title', Title);
    game.state.add('Main', Main);
    game.state.start('Title');
  }
});