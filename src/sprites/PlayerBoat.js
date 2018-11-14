// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import config from '../config'
// import Wake from '../sprites/wake.js'

// GameData in src
import GameData from '../GameData'
import Test_Cannonball from './Test_Cannonball'

class PlayerBoat extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // super(game, x, y, 'Pirat_Ship_1', 0)
    super(game, x, y, 'player-med', 0)
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

    this.body.debug = __DEV__ // shows hitbox
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


    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    // keeps track of projectiles
    this.shotType = GameData.shotTypes.MULTISHOT

    // player health
    this.maxHealth = 100;
    this.health = 50;
    this.minHealth = 0;
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
    this.animations.add('moveFWD', [23, 24, 25, 26], 10, true)
  }

  moveForward () {
    if (this.curBoatSpeed < this.intBoatSpeed) {
      this.curBoatSpeed += 2
    }
    this.body.moveForward(this.curBoatSpeed)
    if (this.health < this.maxHealth) {
      this.health++;
    }
  }

  slowDown () {
    if (this.curBoatSpeed > 0) {
      this.curBoatSpeed -= 0.2
    }
    this.body.moveForward(this.curBoatSpeed)
    if (this.health > this.minHealth) {
      this.health--;
    }
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

  // Delete projectiles after x amount of seconds or collision
  hitCannonball (body1, body2) {
    // body1 is the ship (as it's the body that owns the callback)
    // body2 is the body it impacted with, in this case projectiles

    // body2.sprite.kill()
    // for some reason, the line of code below, relating to destory, causes the game to crash after the player collides with the projectile
    body2.destroy()
  }

  // Choose projectile type for the left side of the ship
  firingCallback () {
    console.log(GameData.shotTypes.HARPOON)
    switch (GameData.shotTypes.HARPOON) {
      case GameData.shotTypes.HARPOON:
        console.log('o')
        this.harpoon()
        break
      case GameData.shotTypes.MULTISHOT:
        console.log('k')
        this.spreadShotLeft()
        break
      case GameData.shotTypes.EXTRA:
        //
        break
      default:
    }
    // this.spreadShotLeft()
    // this.harpoon()
  }

  // Choose projectile type for the right side of the ship
  firingCallback2 () {
    this.spreadShotRight()
  }

  // DOES NOT WORK ATM
  // Firing rate for the left side of the ship
  firingCallbackCooldown () {
    if (this.timer === 0) {
      this.firingCallback()
      this.timer = 4000
      while (this.timer > 0) {
        this.timer--
      }
    }
  }

  // DOES NOT WORK ATM
  // Firing rate for the right side of the ship
  firingCallbackCooldown2 () {
    if (this.timer2 === 0) {
      this.firingCallback2()
      this.timer2 = 4000
      while (this.timer2 > 0) {
        this.timer2--
      }
    }
  }

  harpoon () {
    console.log('o')
    let mousex = this.game.input.x
    let mousey = this.game.input.y
    console.log('MousePos: [' + mousex + ',' + mousey + ']')
    let shipx = this.x / 2
    let shipy = this.y / 2
    console.log('ShipPos: [' + shipx + ',' + shipy + ']')
    let directionx = mousex - shipx
    let directiony = mousey - shipy
    let magnitude = Math.sqrt(((Math.pow(directionx, 2)) + (Math.pow(directiony, 2))))
    let unitx = directionx / magnitude
    let unity = directiony / magnitude
    let harpoonAngle = (Math.atan(directiony / directionx) * (180 / Math.PI))
    console.log('DIRECTION: [' + directionx + ',' + directiony + ']')
    let cannonball = new Test_Cannonball({
      game: this.game,
      x: this.x,
      y: this.y
    })

    this.projectile.add(cannonball)
    cannonball.body.setRectangle(2, 2)
    // cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)

    this.cannonballWidth = 10
    this.cannonballHeight = 20

    if (harpoonAngle > 0) {
      cannonball.body.angle = harpoonAngle - 90
    }

    else {
      cannonball.body.angle = harpoonAngle + 90
    }

    cannonball.body.velocity.x = unitx * 500
    cannonball.body.velocity.y = unity * 500

    console.log(harpoonAngle)

    // let shipP = new Phaser.Point(shipx, shipy)
    // let mouseP = new Phaser.Point(mousex, mousey)
    // cannonball.body.angle = shipP.angle(mouseP)

    // cannonball.angle = Math.atan2(mousey - shipy, mousex - shipx)

    // cannonball.body.moveForward(1000)

    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight

    // this.game.p2.moveToPointer(cannonball, 100)
  }

  spreadShotLeft () {
    // Create projectile object
    console.log('o')
    let cannonball = new Test_Cannonball({
      game: this.game,
      x: this.x,
      y: this.y
    })
    let cannonball2 = new Test_Cannonball({
      game: this.game,
      x: this.x,
      y: this.y + 7.5
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: this.x,
      y: this.y - 7.5
    })
    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set hitbox size for projectile
    cannonball.body.setRectangle(2, 2)
    cannonball2.body.setRectangle(2, 2)
    cannonball3.body.setRectangle(2, 2)
    // Tell cannonball to use cannonballCollisionGroup
    cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

    //  Cannonballs will collide against themselves and the player
    //  If this is not set, cannonballs will not collide with anything
    // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 10
    this.cannonballHeight = 20

    // Set cannonball angle, velocity, and size
    cannonball.body.angle = this.angle - 90
    cannonball.body.moveForward(500)
    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight

    // cannonball2.x = this.playerMP.angle + 100
    // cannonball2.y = this.playerMP.angle + 100
    cannonball2.body.angle = this.angle - 90
    cannonball2.body.moveForward(500)
    cannonball2.width = this.cannonballWidth
    cannonball2.height = this.cannonballHeight

    // cannonball3.x = this.playerMP.angle - 100
    // cannonball3.y = this.playerMP.angle - 100
    cannonball3.body.angle = this.angle - 90
    cannonball3.body.moveForward(500)
    cannonball3.width = this.cannonballWidth
    cannonball3.height = this.cannonballHeight
  }

  spreadShotRight () {
    // Create projectile object
    console.log('o')
    let cannonball = new Test_Cannonball({
      game: this.game,
      x: this.x,
      y: this.y
    })
    let cannonball2 = new Test_Cannonball({
      game: this.game,
      x: this.x,
      y: this.y + 7.5
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: this.x,
      y: this.y - 7.5
    })
    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set hitbox size for projectile
    cannonball.body.setRectangle(2, 2)
    cannonball2.body.setRectangle(2, 2)
    cannonball3.body.setRectangle(2, 2)
    // Tell cannonball to use cannonballCollisionGroup
    cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

    //  Cannonballs will collide against themselves and the player
    //  If this is not set, cannonballs will not collide with anything
    // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 10
    this.cannonballHeight = 20

    // Set cannonball angle, velocity, and size
    cannonball.body.angle = this.angle + 90
    cannonball.body.moveForward(500)
    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight

    // cannonball2.x = this.playerMP.angle + 10
    // cannonball2.y = this.playerMP.angle + 10
    cannonball2.body.angle = this.angle + 90
    cannonball2.body.moveForward(500)
    cannonball2.width = this.cannonballWidth
    cannonball2.height = this.cannonballHeight

    // cannonball3.x = this.playerMP.angle + 10
    // cannonball3.y = this.playerMP.angle + 10
    cannonball3.body.angle = this.angle + 90
    cannonball3.body.moveForward(500)
    cannonball3.width = this.cannonballWidth
    cannonball3.height = this.cannonballHeight
  }


  // destroy () {
  //   this.body.sprite.kill()
  //   this.body.destroy()
  // }

}

export default PlayerBoat
