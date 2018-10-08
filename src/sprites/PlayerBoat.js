// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import config from '../config'

class PlayerBoat extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // super(game, x, y, 'Pirat_Ship_1', 0)
    super(game, x, y, 'medBoat', 0)
    this.name = 'Player Ship'
    this.anchor.setTo(0.5, 0.5)
    // turn off smoothing (this is pixel art)
    this.smoothed = false;

    // Set a reference to the top-level phaser game object
    this.game = game;
    
    // setup the states
    this.TURNINGL = false;
    this.TURNINGR = false;
    this.MOVEFWD = false;
    this.MOVEBCK = false;
    this.STOPPED = true;

    // set player scale
    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    // Create a P2 physics body for this sprite
    this.game.physics.p2.enable(this)
    this.body.debug = __DEV__
    this.body.collideWorldBounds = true

    // Create a custom shape for the collider body
    this.body.setRectangle(12 * config.PLAYER_SCALE, 32 * config.PLAYER_SCALE, 0, 0)
    this.body.offset.setTo(0.25, 0)

    // Configure custom physics properties
    this.body.damping = 0.5
    this.body.data.gravityScale = 0

    // setup movement physics
    this.intBoatSpeed = 60;
    this.curBoatSpeed = 0;
    this.turnspd = 25;
    this.bckspd = 10;
    this.turnangle = 0.6;

    // setup collisions

    this.body.setCollisionGroup(this.game.playerGroup)
    this.body.collides([this.game.enemyGroup], [this.game.itemGroup], [this.game.landGroup])

    // adds the animations to the sprite
    this.setupAnimations()
    this.animations.play('idle', true)
  }

  update () {
    // Always give parent a chance to update
    super.update()

    // set animation states
    if (this.curBoatSpeed > 20) {
      this.MOVEFWD = true;
      this.STOPPED = false;
    } else {
      this.MOVEFWD = false;
      this.STOPPED = true;
    }

    // check animation states, play appropriate animation
    if (this.MOVEFWD === true && this.TURNINGL === false && this.TURNINGR === false) {
      this.animations.play('moveFWD');
    } else {
      this.animations.play('idle');
    }
  }

  // create the animations
  setupAnimations () {
    this.animations.add('idle', [0, 1, 2, 3, 4], 5, true)
    this.animations.add('moveFWD', [5, 6, 7, 8], 10, true)
  }
}

export default PlayerBoat
