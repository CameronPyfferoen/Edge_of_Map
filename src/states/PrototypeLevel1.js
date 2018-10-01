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

    this.setupKeyboard()

    this.game.camera.scale.x = 4.2
    this.game.camera.scale.y = 4.2
    this.game.camera.follow(this.player)
  }

  setupKeyboard () {
    // register keys
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.forward = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)

    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP
    ])
     
  }

  update () {
    // this.player.angle += 1
    // ...body.moveForward(x)

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

}
// Expose the class TestLevel to other files
export default PrototypeLevel1
