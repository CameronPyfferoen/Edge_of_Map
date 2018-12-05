// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import config from '../config'
import { sequentialNumArray } from '../utils.js'
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
    this.dead = false;

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
    // this.body.setRectangle(12 * config.PLAYER_SCALE, 32 * config.PLAYER_SCALE, 0, 0)
    this.body.clearShapes();
    this.body.addCapsule(12, 6, 0, 0, -1.55)
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

    // keeps track of projectile type
    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    this.shotType = GameData.shotTypes.MULTISHOTx

    // player health
    this.maxHealth = 100;
    this.health = 100;
    this.minHealth = 0;

    this.timer = null
    this.timer2 = null
    this.canFire = true
    this.canFire2 = true
  }

  update () {
    // Always give parent a chance to update
    super.update()
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth;
    }

    // set animation states
    if (this.curBoatSpeed > 20 && this.health > 0) {
      this.MOVEFWD = true
      this.STOPPED = false
      // this.spawnWake();
    } else {
      this.MOVEFWD = false
      this.STOPPED = true
    }

    // check animation states, play appropriate animation
    if (this.MOVEFWD === true && this.health > 0) {
      this.animations.play('moveFWD')
    } else if (this.health > 0) {
      this.animations.play('idle')
    } else if (this.dead === false) {
      this.animations.play('death')
      this.animations.currentAnim.onComplete.add(this.youAreDead, this);
    } else {
      this.animations.play('ded');
    }
  }

  // create the animations
  setupAnimations () {
    this.animations.add('idle', [0, 1, 2, 3, 4], 5, true)
    this.animations.add('moveFWD', [23, 24, 25, 26], 10, true)
    this.death = this.animations.add('death', sequentialNumArray(138, 160), 10, false);
    this.animations.add('ded', [27], 1, false);
  }

  youAreDead () {
    this.dead = true;
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
  // Delete projectiles after x amount of seconds or collision
  hitCannonball (body1, body2) {
    // body1 is the ship (as it's the body that owns the callback)
    // body2 is the body it impacted with, in this case projectiles

    // body2.sprite.kill()
    // for some reason, the line of code below, relating to destory, causes the game to crash after the player collides with the projectile
    body2.destroy()
  }

  // Choose projectile type for the left side of the ship
  // NOTE, only GameData.shotTypes.MULTISHOT works
  firingCallback () {
    console.log('k')
    if (this.health > 0) {
      // console.log(GameData.shotTypes.HARPOON)
      switch (GameData.shotTypes.MULTISHOT) {
        case GameData.shotTypes.HARPOON:
          // console.log('o')
          this.harpoon()
          break
        case GameData.shotTypes.MULTISHOT:
          // console.log('k')
          if (this.canFire === true) {
            this.spreadShotLeft()
            this.canFire = false
            this.firingCallbackCooldown()
            // console.log('k')
          }
          break
        case GameData.shotTypes.EXTRA:

          break
        default:
      }
    // this.spreadShotLeft()
    // this.harpoon()
    }
  }

  // Choose projectile type for the right side of the ship
  firingCallback2 () {
    if (this.health > 0) {
      if (this.canFire2 === true) {
        this.spreadShotRight()
        this.canFire2 = false
        this.firingCallbackCooldown2()
        // console.log('k')
      }
    }
  }

  // My thoughts and questions
  // why does the firingCallback begin after what seems to be 2000ms
  // how do I fire instantly?

  firingCallbackCooldown () {
    //  Create our Timer
    this.timer = this.game.time.create(false)

    //  Set a TimerEvent to occur after 2 seconds
    this.timer.add(500, function () {
      this.canFire = true
    }.bind(this))

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    this.timer.start()
  }

  firingCallbackCooldown2 () {
    //  Create our Timer
    this.timer2 = this.game.time.create(false)

    //  Set a TimerEvent to occur after 2 seconds
    this.timer2.add(500, function () {
      this.canFire2 = true
    }.bind(this))

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    this.timer2.start()
  }

  // The harpoon function isn't really used
  harpoon () {
    // console.log('o')
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

  rotate (cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle,
    cos = Math.cos(radians),
    sin = Math.sin(radians),
    nx = (cos * (x - cx)) + (sin * (y - cy)) + cx,
    ny = (cos * (y - cy)) - (sin * (x - cx)) + cy;
    console.log(nx)
    console.log(ny)
    return [nx, ny]
  }

  spreadShotLeft () {
    // Create projectile object
    // console.log('o')
    this.game.camera.shake(0.001, 250);
    this.game.explosion.play('', 0, config.SFX_VOLUME);
    let canPos1 = [this.x, this.y]
    let canPos2 = [this.x, this.y + 7.5]
    let canPos3 = [this.x, this.y - 7.5]

    canPos1 = this.rotate(this.x, this.y, canPos1[0], canPos1[1], this.angle * -1)
    canPos2 = this.rotate(this.x, this.y, canPos2[0], canPos2[1], this.angle * -1)
    canPos3 = this.rotate(this.x, this.y, canPos3[0], canPos3[1], this.angle * -1)

    let cannonball = new Test_Cannonball({
      game: this.game,
      x: canPos1[0],
      y: canPos1[1]
    })
    let cannonball2 = new Test_Cannonball({
      game: this.game,
      x: canPos2[0],
      y: canPos2[1]
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: canPos3[0],
      y: canPos3[1]
    })

    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set hitbox size for projectile
    // cannonball.body.setRectangle(2, 2, 0, -7)
    // cannonball2.body.setRectangle(2, 2, 0, -7)
    // cannonball3.body.setRectangle(2, 2, 0, -7)

    // Tell cannonball to use cannonballCollisionGroup
    // cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    // cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    // cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

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
    // console.log('o')
    this.game.camera.shake(0.001, 250);
    this.game.explosion.play('', 0, config.SFX_VOLUME);
    let canPos1 = [this.x, this.y]
    let canPos2 = [this.x, this.y + 7.5]
    let canPos3 = [this.x, this.y - 7.5]

    canPos1 = this.rotate(this.x, this.y, canPos1[0], canPos1[1], this.angle * -1)
    canPos2 = this.rotate(this.x, this.y, canPos2[0], canPos2[1], this.angle * -1)
    canPos3 = this.rotate(this.x, this.y, canPos3[0], canPos3[1], this.angle * -1)

    let cannonball = new Test_Cannonball({
      game: this.game,
      x: canPos1[0],
      y: canPos1[1]
    })
    let cannonball2 = new Test_Cannonball({
      game: this.game,
      x: canPos2[0],
      y: canPos2[1]
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: canPos3[0],
      y: canPos3[1]
    })

    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set hitbox size for projectile
    // cannonball.body.setRectangle(2, 2, 0, -7)
    // cannonball2.body.setRectangle(2, 2, 0, -7)
    // cannonball3.body.setRectangle(2, 2, 0, -7)

    // Tell cannonball to use cannonballCollisionGroup
    // cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    // cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    // cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

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
