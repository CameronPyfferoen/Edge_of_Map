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
    this.body.setRectangle(64 * config.PLAYER_SCALE, 64 * config.PLAYER_SCALE, 0, 0)
    this.body.offset.setTo(0, 0)

    // Configure custom physics properties
    this.body.damping = 0.5
    this.body.data.gravityScale = 0

    this.forward = false
    this.setupKeyboard();

    this.fwdspd = 50;
    this.bckspd = 10;
  }

  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  }

  update () {
    // Always give parent a chance to update
    super.update()
    this.animations.play('idle')

    // input
    if (this.forwardKey.isDown) {
      this.body.moveForward(this.fwdspd);
    }
    if (this.leftKey.isDown)
    {
      this.body.angle -= 0.8;
      if (!this.forwardKey.isDown && this.body.speed !== 0) {
        this.body.thrust(35)
      }
    }
    if (this.backwardKey.isDown)
    {
      this.body.moveBackward(this.bckspd);
    }
    if (this.rightKey.isDown)
    {
      this.body.angle += 0.8;
      if (!this.forwardKey.isDown && this.body.speed !== 0) {
        this.body.thrust(35)
      }
    }
    else { this.body.angularVelocity = 0; }
  }

  setupAnimations () {
    this.animations.add('idle', [0], 1, false)
  }

  velocityFromRotation (rotation, speed, point) {
    if (speed === undefined) { speed = 60 }
    point = point || new Phaser.Point()

    return point.setToPolar(rotation, speed)
  }

}

export default PlayerBoat
