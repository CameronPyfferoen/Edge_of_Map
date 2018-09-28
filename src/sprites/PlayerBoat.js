// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import config from '../config'

class PlayerBoat extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'Pirat_Ship_1', 0)
    this.name = 'Player Ship'
    this.anchor.setTo(0.5, 0.5)
    // turn off smoothing (this is pixel art)
    this.smoothed = false

    // Set a reference to the top-level phaser game object
    this.game = game

    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    // Create a P2 physics body for this sprite
    this.game.physics.p2.enable(this)
    this.body.debug = __DEV__
    this.body.collideWorldBounds = true

    // Create a custom shape for the collider body
    this.body.setRectangle(100, 100, 0, 0)
    this.body.offset.setTo(0, 0)

    // Configure custom physics properties
    this.body.damping = 0.5
    this.body.data.gravityScale = 0
  }

  upddate () {
    // Always give parent a chance to update
    super.update()
    this.animations.play('idle')
  }

  setupAnimations () {
    this.animations.add('idle', [0], 1, false)
  }

}

export default PlayerBoat
