// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import config settings
import config from '../config'

// Import the player boat
import PlayerBoat from '../sprites/PlayerBoat'

class PrototypeLevel1 extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
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
  }

  setupKeyboard () {
    // register keys
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.forward = this.game.input.keyboard.addKey(Phaser.keyboard.UP)

    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP
    ])
  }

  update () {

  }
}
// Expose the class TestLevel to other files
export default PrototypeLevel1
