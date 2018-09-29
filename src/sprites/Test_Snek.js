import Phaser from 'phaser';
import config from '../config';

class Test_Snek extends Phaser.Sprite
{
  constructor ({ game, x, y }) {
    super(game, x, y, 'sea_snake_16x', 0);
    this.name = 'Test Snek';
    this.anchor.setTo(0.5, 0.5);

    this.smoothed = true;

    this.game = game;

    this._SCALE = config.PLAYER_SCALE;
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this);
    
    this.body.debug = __DEV__;
    this.body.colliderWorldBounds = false;
    
    this.body.setRectangle(64 * config.PLAYER_SCALE, 64 * config.PLAYER_SCALE, 0, 0);
    this.body.offset.setTo(0,0);

    this.body.damping = 0.5;
    this.body.data.gravityScale = 0;

    this.setupKeyboard();
    //this.sprite.inputEnabled = true;

  }

  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  }

  update () {
    super.update();
    // this.sprite.body.setZeroVelocity();
    this.animations.play('snek');

    // input
    if (this.forwardKey.isDown)
    {
      this.body.moveForward(50);
    }
    if (this.leftKey.isDown)
    {
      this.body.angle -= 0.1;
    }
    if (this.backwardKey.isDown)
    {
      this.body.moveBackward(10);
    }
    if (this.rightKey.isDown)
    {
      this.body.angle += 0.1;
    }
     else { this.body.angularVelocity = 0; }
  }

  setupAnimations () {
    this.animations.add('snek', [0], 1, false);
  }
}
export default Test_Snek
