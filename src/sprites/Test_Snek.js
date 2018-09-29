import Phaser from 'phaser';
import config from '../config';

class Test_Snek extends Phaser.Sprite
{
  constructor ({ game, x, y }) {
    super(game, x, y, 'seasnake_16x', 0);
    this.name = 'Test Snek';
    this.anchor.setTo(0.5,0.5);

    this.smoothed = true;

    this.game = game;

    this._SCALE = config.PLAYER_SCALE;
    this._SCALE.setTo(this._SCALE)

    this.game.physics.p2.enable(this);
    this.body.debug = __DEV__;
    this.body.colliderWorldBounds = false;
    
    this.body.setRectangle(55, 130, 0, 30);
    this.body.offset.setTo(0,0);

    this.body.damping = 0.5;

    this.sprite.inputEnabled = true;

  }

  update() {
    super.update();
    this.sprite.body.setZeroVelocity();

    //input
    if(this.game.input.keyboard.isDown(Phaser.Keycode.W))
    {
      this.sprite.body.physics.p2.angle.moveForward(50);
    }
    if(this.game.input.keyboard.isDown(Phaser.Keycode.A))
    {
      this.sprite.body.physics.p2.angle -= 1;
    }
    if(this.game.input.keyboard.isDown(Phaser.Keycode.S))
    {
      this.sprite.body.physics.p2.angle.moveBackward(10);
    }
    if(this.game.input.keyboard.isDown(Phaser.Keycode.D))
    {
      this.sprite.body.physics.p2.angle += 1;
    }
  }
}
export default Test_Snek
