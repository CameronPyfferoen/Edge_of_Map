// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import config from '../config'

class TestCrab extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'crab_blue_16x', 0)
    this.name = 'Test Crab'
    this.anchor.setTo(0.5, 0.5)

    // turn off smoothing (this is pixel art)
    this.smoothed = false

    // Set a reference to the top-level phaser game object
    this.game = game

    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    // Create a P2 physics body for this sprite
    this.game.physics.p2.enable(this)
    // this.body.debug = __DEV__
    this.body.collideWorldBounds = false
    this.body.fixedRotation = true

    // Create a custom shape for the collider body
    this.body.setRectangle(55, 130, 0, 30)
    this.body.offset.setTo(0, 0)

    // Configure custom physics properties
    this.body.damping = 0.5
  }

  // Function that runs every tick to update this sprite
  update () {
    // Always give parent a chance to update
    super.update()
  }
}

export default TestCrab
