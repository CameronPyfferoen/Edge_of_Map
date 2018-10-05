import Phaser from 'phaser';
import config from '../config';
import Test_Snek from '../sprites/Test_Snek';
import { Sprite } from 'phaser-ce';
import PlayerBoat from '../sprites/PlayerBoat';

class Cam_TestLevel extends Phaser.State {
  init () {
    this.game.add.tileSprite(0 , 0, 3149, 2007, 'map')
    this.game.world.setBounds(0, 0, 3149, 2007)
  }

  preload () {}

  create () {
    this.player = new PlayerBoat({
      game: this.game,
      x: this.world.centerX - 100,
      y: this.world.centerY
    })

    this.snek = new Test_Snek({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32
    })

    this.game.add.existing(this.snek);

    this.game.camera.scale.x = 4.2
    this.game.camera.scale.y = 4.2
    this.game.camera.follow(this.player)

    this.setupKeyboard()
  }

  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  }

  update () {
    this.game.debug.spriteInfo(this.player, 32, 32)
    this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00');
    // this.player.angle += 1
    // ...body.moveForward(x)
    if (this.forwardKey.isDown) {
      if (__DEV__) console.log('forward key')
      this.player.body.moveForward(this.player.fwdspd);
    }
    if (this.leftKey.isDown)
    {
      if (__DEV__) console.log('left key')
      this.player.body.angle -= this.player.turnangle;
      if (!this.forwardKey.isDown && this.player.body.speed !== 0) {
        this.player.body.thrust(this.player.turnspd)
      }
    }
    if (this.backwardKey.isDown)
    {
      if (__DEV__) console.log('back key')
      this.player.body.moveBackward(this.player.bckspd);
    }
    if (this.rightKey.isDown)
    {
      if (__DEV__) console.log('right key')
      this.player.body.angle += this.player.turnangle;
      if (!this.forwardKey.isDown && this.player.body.speed !== 0) {
        this.player.body.thrust(this.player.turnspd)
      }
    }
    else { this.player.body.angularVelocity = 0; }
  }
}

export default Cam_TestLevel
