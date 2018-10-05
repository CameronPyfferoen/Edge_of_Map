import Phaser from 'phaser';
import config from '../config';
import PlayerBoat from '../sprites/PlayerBoat'

class Test_Snek extends Phaser.Sprite
{
  constructor ({ game, x, y }) {
    super(game, x, y, 'seasnake', 0);
    this.name = 'Test Snek';
    this.anchor.setTo(0.5, 0.5);

    this.smoothed = true;

    this.game = game;
    
    this.playerFind = this.game.PlayerBoat;
    console.log('Player: ' + this.playerFind)

    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this);
    
    this.body.debug = __DEV__;
    this.body.colliderWorldBounds = false
    
     this.body.setRectangle(60 * this._SCALE, 130 * this._SCALE, 0, 0);
     this.body.offset.setTo(0.5, 1.5);

    this.body.damping = 0.5;
    this.body.data.gravityScale = 0;

    this.player_dist = 1000000;
    this.pat_dist = 200;
    this.start_diff = 0;

    this.fwdspd = 20;
    this.turnspd = 10;
    this.angspd = 0.8;
    this.chasespd = 30

    this.startx = this.body.x
    this.starty = this.body.y
    this.startang = this.body.angle
    this.turn = false

    this.setupAnimations()
  }

  /*
  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  } */

  patrol () {
    this.animations.play('swim')
    if (!this.turn) {
      this.body.moveForward(this.fwdspd)
      if(this.pat_dist <= this.start_diff) {
        this.turn = true;
      }
    }
    else if(this.turn) {
      this.body.angle += this.angspd
      this.body.moveForward(this.turnspd)
      if((this.body.angle >= this.startang + 175 && this.body.angle <= this.startang + 180 ) || (this.body.angle <= this.startang - 175 && this.body.angle >= this.startang - 180) || (this.body.angle >= this.startang && this.body.angle <= this.startang + 5 ) || (this.body.angle <= this.startang && this.body.angle >= this.startang - 5)) {
        this.turn = false;
        console.log("else if statement was entered" )
      }
    }
    
  }

  chase () {
    this.animations.play('swim')
    this.moveToObject(this.Sprite, this.playerFind)
  }

  update () {
    super.update();
    this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.playerFind.body.x, this.playerFind.body.y)
    this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    if(this.player_dist > 50) {
      this.patrol()
    }
    else if(this.player_dist <= 50)
    {
      this.chase()
    } 
    
  }

  setupAnimations () {
    this.animations.add('snek', [0], 1, false);
    this.animations.add('swim', [0, 1, 2, 3, 4, 5, 6 , 7], 10, true)
  }

  moveToObject(obj1, obj2) {
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x);
    obj1.body.rotation = angle + Phaser.Math.degToRad(90);  // correct angle of angry bullets (depends on the sprite used)
    obj1.body.force.x = Math.cos(angle) * this.chasespd;    // accelerateToObject 
    obj1.body.force.y = Math.sin(angle) * this.chasespd;
  }
}
export default Test_Snek
