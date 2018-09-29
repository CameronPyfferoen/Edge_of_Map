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
    // create the player object
    this.player = new PlayerBoat({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32
    })

    this.game.add.existing(this.player)
    this.setupKeyboard()
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
    if (this.forward.isDown) { this.player.body.moveForward(75) } 
    else { this.player.body.angularVelocity = 0 } 
  }

}
// Expose the class TestLevel to other files
export default PrototypeLevel1
