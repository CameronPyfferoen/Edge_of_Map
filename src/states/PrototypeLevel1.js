// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import config settings
import config from '../config'

// Import the player boat
import PlayerBoat from '../sprites/PlayerBoat'
import { Sprite } from 'phaser-ce';

class PrototypeLevel1 extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.add.tileSprite(0, 0, 3149, 2007, 'map');
    this.game.world.setBounds(0, 0, 3149, 2007)
    this.game.time.advancedTiming = true
    // this.game.time.desiredFPS = 30

  }

  preload () {}

  create () {
    // create the player object and setup the camera and inputs
    this.player = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })

    this.game.add.existing(this.player)

    // this.setupKeyboard()

    // frame of the game
    this.game.camera.scale.x = 4.2
    this.game.camera.scale.y = 4.2
    this.game.camera.follow(this.player)

    this.setupKeyboard();
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
  /*
    if (this.leftKey.isDown) { this.player.body.angle -= 1 }
    if (this.rightKey.isDown) { this.player.body.angle += 1 }
    if (!this.leftKey.isDown && !this.rightKey.isDown) { this.player.body.angularVelocity = 0 }

    if (this.forward.isDown) { 
      this.player.body.moveForward(75)
      this.player.forward = true
    } else {
      // this.player.body.setZeroVelocity()
      if (this.player.forward == true) {
        this.player.body.thrust(200)
        this.player.forward = false
      }
    }
    // if (this.forward.isDown) {this.player.body.velocity = this.player.velocityFromAngle(this.player.body.angle, 75, this.player.body.velocity) }

    this.game.debug.spriteInfo(this.player, 32, 32)
  }
    if (this.leftKey.isDown) { this.player.body.angle -= 1 }
    if (this.rightKey.isDown) { this.player.body.angle += 1 }
    if (this.forward.isDown) { this.player.body.moveForward(75) }
    // if (this.forward.isDown) { this.player.velocityFromAngle(this.player.body.angle, 75, this.player.body.velocity) } 
    else { this.player.body.angularVelocity = 0 }
  */
}
// Expose the class TestLevel to other files
export default PrototypeLevel1
