// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import config from '../config'
import { sequentialNumArray } from '../utils.js'
// import Wake from '../sprites/wake.js'

// GameData in src
import GameData from '../GameData'
import Test_Cannonball from './Test_Cannonball'
import { Line } from 'phaser-ce'

class PlayerBoat extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // super(game, x, y, 'Pirat_Ship_1', 0)
    super(game, x, y, 'player-med', 0)
    this.name = 'Player Ship'
    this.anchor.setTo(0.5, 0.5)
    // turn off smoothing (this is pixel art)
    this.smoothed = false
    this.dead = false

    this.game = game

    // setup the states
    this.TURNINGL = false
    this.TURNINGR = false
    this.MOVEFWD = false
    this.MOVEBCK = false
    this.STOPPED = true
    this.playedDeathSoundTimer = 0

    // set player scale
    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    // Create a P2 physics body for this sprite
    this.game.physics.p2.enable(this)

    this.body.debug = __DEV__ // shows hitbox
    this.body.collideWorldBounds = true

    // Create a custom shape for the collider body
    // this.body.setRectangle(12 * config.PLAYER_SCALE, 32 * config.PLAYER_SCALE, 0, 0)
    this.body.clearShapes()
    this.body.addCapsule(12, 6, 0, 0, -1.55)
    this.body.offset.setTo(0.25, 0)

    // Configure custom physics properties
    this.body.damping = 0.5
    this.body.data.gravityScale = 0

    this.body.setCollisionGroup(this.game.playerGroup)
    this.body.collides([this.game.enemyGroup, this.game.itemGroup, this.game.landGroup, this.game.projectileGroup])

    // collision stuff
    this.bodyShape = this.body.data.shapes[0]
    this.bodyShape.sensor = true
    this.body.onBeginContact.add(this.contact, this)
    this.n = 0
    this.isLand = false
    this.isEnemy = false
    this.isBall = false
    this.control = true
    this.bitArray = []
    this.count = 0
    this.ram_damage =

    // experimental
    this.conAngDiffDeg = 0
    this.conLine = new Line(this.body.x, this.body.y, this.body.x + 2, this.body.y + 2)

    this.behindLine = new Line(this.body.x, this.body.y, this.body.x + 2, this.body.y + 2)
    this.backCollide = []
    this.fwdthrust = false
    this.backthrust = false
    this.m = 0

    // console.log(`Enemy bitmask: ${this.game.enemyGroup.mask}`)
    // setup movement physics
    this.intBoatSpeed = 80
    this.curBoatSpeed = 0
    this.turnspd = 40
    this.bckspd = 20
    this.turnangle = 0.8

    // adds the animations to the sprite
    this.setupAnimations()
    this.animations.play('idle', true)

    // keeps track of projectile type
    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    this.shotType = GameData.shotTypes.MULTISHOTx

    // player health
    this.maxHealth = 100
    this.health = 100
    this.minHealth = 0
    this.invincible = false

    // variables for firing cooldown
    this.timer = null
    this.timer2 = null
    this.canFire = true
    this.canFire2 = true
  }

  getvincible () {
    return this.invincible
  }

  update () {
    // Always give parent a chance to update
    // super.update()
    // console.log(`player invincible: ${this.invincible}`)
    // this.game.debug.geom(this.behindLine, '#FF0', true)
    // console.log(`boat rotation: ${this.body.rotation}`)
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
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
      if (this.playedDeathSoundTimer === 0) {
        this.game.sounds.play('explosion', config.SFX_VOLUME)
      } else if (this.playedDeathSoundTimer === 30) {
        this.game.sounds.play('explosion', config.SFX_VOLUME)
      } else if (this.playedDeathSoundTimer === 60) {
        this.game.sounds.play('explosion', config.SFX_VOLUME)
        this.body.clearShapes()
      }
      this.playedDeathSoundTimer++
      this.animations.play('death')
      this.animations.currentAnim.onComplete.add(this.youAreDead, this)
    } else {
      this.animations.play('ded')
    }
    // look here
    // cut if not working
    if (this.isLand || this.isEnemy) {
      console.log(`update backthrust: ${this.backthrust}`)
      console.log(`update fwdthrust: ${this.fwdthrust}`)
      this.invincible = true
      this.control = false
      // console.log(`this.count: ${this.count}`)
      if (this.count < 30) {
        this.body.setZeroVelocity()
        this.body.angularVelocity = 0
        this.curBoatSpeed = 0
      } else if (this.count < 60 && this.count >= 30 && this.backthrust) {
        this.body.angularVelocity = 0
        this.thrustBackward()
      } 
      else if (this.count < 60 && this.count >= 30 && this.fwdthrust) {
        this.body.angularVelocity = 0
        this.thrustForward()
      }/* else if (this.count >= 10 && this.count < 200) {
        this.turnLeft()
      } */
      else if (this.count >= 60) {
        this.body.setZeroVelocity()
        this.isLand = false
        this.isEnemy = false
        this.control = true
        this.invincible = false
        this.backthrust = false
        this.fwdthrust = false
      }
      if (this.count < 60) {
        this.count++
      }
    }
  }

  // create the animations
  setupAnimations () {
    this.animations.add('idle', [0, 1, 2, 3, 4], 5, true)
    this.animations.add('moveFWD', [23, 24, 25, 26], 10, true)
    this.death = this.animations.add('death', sequentialNumArray(138, 160), 10, false)
    this.animations.add('ded', [27], 1, false)
  }

  getInvince () {
    return this.invincible
  }

  // look here
  // cut if not working
  contact (otherBody, otherP2Body, myShape, otherShape, contactEQ) {
    this.n = 0
    this.m = 0
    if (otherBody !== null) {
      // this.conLine.setTo(this.body.x, this.body.y, otherBody.x, otherBody.y)
      // this.conAngDiffDeg = (this.body.angle - Phaser.Math.radToDeg(this.conLine.angle)) % 360
      if (Math.abs(this.body.rotation) <= Phaser.Math.HALF_PI) {
        this.behindLine.fromAngle(this.body.x, this.body.y + 12, this.body.rotation - 2 * Phaser.Math.HALF_PI, 1)
      }
      else if (Math.abs(this.body.rotation) > Phaser.Math.HALF_PI) {
        this.behindLine.fromAngle(this.body.x, this.body.y - 12, this.body.rotation - 2 * Phaser.Math.HALF_PI, 1)
      }
      console.log(`behindLine rotation: ${this.behindLine.angle}`)
      this.backCollide = this.game.physics.p2.hitTest(this.behindLine.end)
      
      this.backCollide.forEach(element => {
        console.log(`backcollide[${this.m}]: ${this.backCollide[this.m]}`)
        let hitobject = this.backCollide[this.m]
        console.log(`hitbobject: ${hitobject.parent.sprite.name}`)
          
        if (this.backCollide[this.m].parent.sprite.name === 'Player Ship')
        {
          this.backCollide.splice(this.m, 1)
        }
        this.m++
      })
      
      if (this.backCollide.length > 0) {
        console.log(`back collide length: ${this.backCollide.length}`)
        this.fwdthrust = true
      }
      else {
        this.backthrust = true
      }
      // console.log(`collided w/: ${otherBody.sprite.name}`)
      if (otherBody.sprite !== null && otherBody.sprite.name !== null && (otherBody.sprite.name === 'Cannonball' || otherBody.sprite.name === 'Fireball' || otherBody.sprite.name === 'GoldDrop')) {
        // console.log(`collided w/: ${otherBody.sprite.name}`)
        this.isBall = true
      } else if (otherBody.sprite === null) {
        this.isBall = true
      }

      if (!this.isBall) {
        otherBody.collidesWith.forEach(element => {
          this.bitArray.push(otherBody.collidesWith[this.n].mask)
          this.n++
        })
        if (this.bitArray.includes(8)) {
          this.isEnemy = false
        } else {
          this.isEnemy = true
          this.count = 0
        }
        if (this.isEnemy) {
          if (otherBody.sprite !== null) {
            otherBody.sprite.health -= this.ram_damage
          }
        }
        if (this.bitArray.includes(32)) {
          this.isLand = false
        } else {
          this.isLand = true
          this.count = 0
        }
      }
      console.log(`contact backthrust: ${this.backthrust}`)
      console.log(`contact fwdthrust: ${this.fwdthrust}`)
      this.backCollide.length = 0
      this.bitArray.length = 0
      this.isBall = false
    }
  }

  youAreDead () {
    this.dead = true
  }

  moveForward () {
    if (this.curBoatSpeed < this.intBoatSpeed) {
      this.curBoatSpeed += 20
    }
    this.body.moveForward(this.curBoatSpeed)
  }

  slowDown () {
    if (this.curBoatSpeed > 0) {
      this.curBoatSpeed -= 0.8
    }
    this.body.moveForward(this.curBoatSpeed)
  }

  turnLeft () {
    this.body.angle -= this.turnangle
    // this.body.thrustLeft(15)
  }

  turnRight () {
    this.body.angle += this.turnangle
    // this.body.thrustRight(15)
  }

  moveBackward () {
    if (this.curBoatSpeed > 1) {
      this.curBoatSpeed--
    } else {
      this.body.moveBackward(this.bckspd)
    }
  }

  thrustBackward () {
    this.body.reverse(100)
    console.log('thrust back')
  }

  thrustForward () {
    this.body.thrust(100)
    console.log('thrust forward')
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
    body2.destroy()
  }

  // Choose projectile type for the left side of the ship
  // NOTE, only GameData.shotTypes.MULTISHOT works
  firingCallback () {
    console.log('k')
    if (this.health > 0) {
      switch (GameData.shotTypes.MULTISHOT) {
        case GameData.shotTypes.HARPOON:
          this.harpoon()
          break
        case GameData.shotTypes.MULTISHOT:
          if (this.canFire === true) {
            this.spreadShotLeft()
            this.canFire = false
            this.firingCallbackCooldown()
          }
          break
        case GameData.shotTypes.EXTRA:
          break
        default:
      }
    }
  }

  // Choose projectile type for the right side of the ship
  firingCallback2 () {
    if (this.health > 0) {
      if (this.canFire2 === true) {
        this.spreadShotRight()
        this.canFire2 = false
        this.firingCallbackCooldown2()
      }
    }
  }

  // Implement the firerate to the left side of the ship
  firingCallbackCooldown () {
    //  Create our Timer
    this.timer = this.game.time.create(false)

    //  Set a TimerEvent to occur after 2 seconds
    this.timer.add(750, function () {
      this.canFire = true
    }.bind(this))

    //  Start the timer running - this is important!
    //  It won't start automatically, allowing you to hook it to button events and the like.
    this.timer.start()
  }

  // Implement the firerate to the right side of the ship
  firingCallbackCooldown2 () {
    this.timer2 = this.game.time.create(false)

    this.timer2.add(750, function () {
      this.canFire2 = true
    }.bind(this))

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

    this.cannonballWidth = 20
    this.cannonballHeight = 20

    if (harpoonAngle > 0) {
      cannonball.body.angle = harpoonAngle - 90
    } else {
      cannonball.body.angle = harpoonAngle + 90
    }

    cannonball.body.velocity.x = unitx * 500
    cannonball.body.velocity.y = unity * 500

    console.log(harpoonAngle)

    // let shipP = new Phaser.Point(shipx, shipy)
    // let mouseP = new Phaser.Point(mousex, mousey)
    // cannonball.body.angle = shipP.angle(mouseP)
  }

  // Code for rotating cannonballs with the player ship
  rotate (cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle
    let cos = Math.cos(radians)
    let sin = Math.sin(radians)
    let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx
    let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
    console.log(nx)
    console.log(ny)
    return [nx, ny]
  }

  spreadShotLeft () {
    // Create projectile object
    // console.log('o')
    this.game.camera.shake(0.001, 250)
    this.game.sounds.play('explosion', config.SFX_VOLUME)
    let canPos1 = [this.x, this.y]
    let canPos2 = [this.x, this.y + 7.5]
    let canPos3 = [this.x, this.y - 7.5]

    // Important to multiply by negative one so the cannonball rotates in the correct direction
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

    // Commented code below was moved to Test_Cannonball for efficiency

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
    this.cannonballWidth = 15
    this.cannonballHeight = 15

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
    this.game.camera.shake(0.001, 250)
    this.game.sounds.play('explosion', config.SFX_VOLUME)
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

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 15
    this.cannonballHeight = 15

    // Set cannonball angle, velocity, and size
    cannonball.body.angle = this.angle + 90
    cannonball.body.moveForward(500)
    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight

    cannonball2.body.angle = this.angle + 90
    cannonball2.body.moveForward(500)
    cannonball2.width = this.cannonballWidth
    cannonball2.height = this.cannonballHeight

    cannonball3.body.angle = this.angle + 90
    cannonball3.body.moveForward(500)
    cannonball3.width = this.cannonballWidth
    cannonball3.height = this.cannonballHeight
  }
}

export default PlayerBoat
