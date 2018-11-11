// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import config from '../config'
// import Wake from '../sprites/wake.js'

// GameData in src
import GameData from '../GameData'

class PlayerBoat extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // super(game, x, y, 'Pirat_Ship_1', 0)
    super(game, x, y, 'medBoat', 0)
    this.name = 'Player Ship'
    this.anchor.setTo(0.5, 0.5)
    // turn off smoothing (this is pixel art)
    this.smoothed = false
    /*
    // create an emitter for the wake
    this.wakeEmitter = this.game.add.emitter(0, 0, 100)
    this.wakeEmitter.makeParticles(['wake1', 'wake2', 'wake3', 'wake4'])
    this.wakeEmitter.gravity = 0;
    */
    // Set a reference to the top-level phaser game object
    this.game = game

    // setup the states
    this.TURNINGL = false
    this.TURNINGR = false
    this.MOVEFWD = false
    this.MOVEBCK = false
    this.STOPPED = true

    // set player scale
    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    // Create a P2 physics body for this sprite
    this.game.physics.p2.enable(this)

    // this.body.debug = __DEV__ // shows hitbox
    this.body.collideWorldBounds = true

    // Create a custom shape for the collider body
    this.body.setRectangle(12 * config.PLAYER_SCALE, 32 * config.PLAYER_SCALE, 0, 0)
    this.body.offset.setTo(0.25, 0)

    // Configure custom physics properties
    this.body.damping = 0.5
    this.body.data.gravityScale = 0

    this.body.setCollisionGroup(this.game.playerGroup)
    this.body.collides([this.game.enemyGroup, this.game.itemGroup, this.game.landGroup, this.game.projectileGroup])
    // this.body.onBeginContact.add(this.onBeginContact, this)
    // this.body.onEndContact.add(this.onExitContact, this)

    // this._overlapping = new Set()

    // setup movement physics
    this.intBoatSpeed = 60
    this.curBoatSpeed = 0
    this.turnspd = 25
    this.bckspd = 10
    this.turnangle = 0.6

    // adds the animations to the sprite
    this.setupAnimations()
    this.animations.play('idle', true)

    // keeps track of projectiles
    this.shotType = GameData.shotTypes.MULTISHOT

  }

  update () {
    // Always give parent a chance to update
    super.update()

    // set animation states
    if (this.curBoatSpeed > 20) {
      this.MOVEFWD = true
      this.STOPPED = false
      // this.spawnWake();
    } else {
      this.MOVEFWD = false
      this.STOPPED = true
    }

    // check animation states, play appropriate animation
    if (this.MOVEFWD === true && this.TURNINGL === false && this.TURNINGR === false) {
      this.animations.play('moveFWD')
    } else {
      this.animations.play('idle')
    }
  }

  // create the animations
  setupAnimations () {
    this.animations.add('idle', [0, 1, 2, 3, 4], 5, true)
    this.animations.add('moveFWD', [5, 6, 7, 8], 10, true)
  }

  moveForward () {
    if (this.curBoatSpeed < this.intBoatSpeed) {
      this.curBoatSpeed += 2
    }
    this.body.moveForward(this.curBoatSpeed)
  }

  slowDown () {
    if (this.curBoatSpeed > 0) {
      this.curBoatSpeed -= 0.2
    }
    this.body.moveForward(this.curBoatSpeed)
  }

  turnLeft () {
    this.body.angle -= this.turnangle
  }

  turnRight () {
    this.body.angle += this.turnangle
  }

  moveBackward () {
    if (this.curBoatSpeed > 1) {
      this.curBoatSpeed--
    } else {
      this.body.moveBackward(this.bckspd)
    }
  }

  /*
  onBeginContact (otherPhaserBody, otherP2Body, myShape, otherShape, contactEquation){
    if((otherPhaserBody.x <= this.body.x + 1 || otherPhaserBody.x >= this.body.x - 1) && (otherPhaserBody.y <= this.body.y + 1 || otherPhaserBody.y >= this.body.y - 1)){
      console.log('collidable')
      this._overlapping.add(otherPhaserBody.Sprite)
    }
  }

  onExitContact (otherPhaserBody, otherP2Body, myShape, otherShape, contactEquation){
    this._overlapping.delete(otherPhaserBody.Sprite)
  }

  interact () {
    this._overlapping.forEach(function (item) {
      item.interact()
    })
  }
  */

  /*
  // create the wakes
  spawnWake () {
    
    let wake = new Wake({
      game: this.game,
      x: this.x,
      y: this.y
    })
    console.log('create wake')
    // this.wake.z = 11
    // console.log('create wake at layer ' + wake.z)
    

    //  Position
    this.wakeEmitter.x = this.body.x
    this.wakeEmitter.y = this.body.y

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    this.wakeEmitter.start(false, 2000, null, 10)
    console.log('spawning wake')
  }
  */
}

export default PlayerBoat
