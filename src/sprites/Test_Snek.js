import Phaser from 'phaser';
import config from '../config';
import PlayerBoat from '../sprites/PlayerBoat'

class Test_Snek extends Phaser.Sprite
{
  constructor ({ game, x, y }) {
    super(game, x, y, 'sea_snake_16x', 0);
    this.name = 'Test Snek';
    this.anchor.setTo(0.5, 0.5);

    this.smoothed = true;

    this.game = game;

    this._SCALE = 1
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this);
    
    this.body.debug = __DEV__;
    this.body.colliderWorldBounds = false
    
    // this.body.setRectangle(1024 * this._SCALE, 2048 * this._SCALE, 0, 0);
    // this.body.offset.setTo(0,0);

    this.body.damping = 0.5;
    this.body.data.gravityScale = 0;

    this.player_dist = 1000000;
    this.pat_dist = 200;
    this.start_diff = 0;

    this.fwdspd = 20;
    this.turnspd = 10;
    this.angspd = 0.8;

    this.startx = this.body.x
    this.starty = this.body.y
    this.startang = this.body.angle
    this.turn = false
  }

  /*
  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  } */

  patrol () {
    if(!this.turn) {
      this.body.moveForward(this.fwdspd)
      if(this.pat_dist <= this.start_diff) {
        this.turn = true;
      }
    }
    else if(this.turn) {
      this.body.angle += this.angspd
      this.body.moveForward(this.turnspd)
      if(this.body.angle == this.startang || this.body.angle == -this.startang) {
        this.turn = false;
      }
    }
    
  }

  update () {
    super.update();
    // this.sprite.body.setZeroVelocity();
    this.animations.play('snek');
    //this.player_dist = 
    this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    this.patrol()
    
  }

  setupAnimations () {
    this.animations.add('snek', [0], 1, false);
  }
}
export default Test_Snek
