var Title = function() {};

Title.prototype = {
  preload: function() {
    game.load.image('titleScreen', 'assets/titlescreen.jpg');
  },
  create: function() {
    game.add.tileSprite(-25, 0, 900, 600, 'titleScreen');
    spaceKey = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spaceKey.onUp.add(this.startGame);
    game.add.text(370, 200, "Press Space To Play", { font: "24px Averia Serif Libre", fill: "#000000", align: "center"})
  },
  update: function() {

  },
  startGame: function() {
    setTimeout(function() {
      game.state.start("Main");
    }, 1000);
  }

};
