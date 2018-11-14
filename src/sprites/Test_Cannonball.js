import Phaser from 'phaser'
import config from '../config'
import PlayerBoat from '../sprites/PlayerBoat'
// import Test_Cannonball from '../sprites/Test_Cannonball'
import GameData from '../GameData'

class Test_Cannonball extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // super(game, x, y, 'sea_snake_16x', 0)
    super(game, x, y, 'cannonball', 0)
    this.name = 'Cannonball'
    this.anchor.setTo(0.5, 0.5)

    this.smoothed = false

    this.game = game

    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this)
    // this.game.debug.body(this)
    this.body.debug = __DEV__
    this.body.collideWorldBounds = true

    this.body.setRectangle(64 * config.PLAYER_SCALE, 64 * config.PLAYER_SCALE, 0, 0)
    this.body.offset.setTo(0, 0)

    this.body.damping = 0.5
    this.body.data.gravityScale = 0

    this.game.time.events.add(Phaser.Timer.SECOND * 2, this.destroy.bind(this), this)
    this.setupAnimations()
  }

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
    switch (this.playerMP.shotType) {
      case GameData.shotTypes.HARPOON:
        this.harpoon()
        break
      case GameData.shotTypes.MULTISHOT:
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
    // this.spreadShotRight()
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
    let shipx = this.playerMP.x / 2
    let shipy = this.playerMP.y / 2
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
      x: this.playerMP.x,
      y: this.playerMP.y
    })

    this.projectile.add(cannonball)
    this.cannonball.body.setRectangle(2, 2)
    this.cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)

    this.cannonballWidth = 10
    this.cannonballHeight = 20

    if (harpoonAngle > 0) {
      this.cannonball.body.angle = harpoonAngle - 90
    }

    else {
      this.cannonball.body.angle = harpoonAngle + 90
    }

    this.cannonball.body.velocity.x = unitx * 500
    this.cannonball.body.velocity.y = unity * 500

    console.log(harpoonAngle)

    // let shipP = new Phaser.Point(shipx, shipy)
    // let mouseP = new Phaser.Point(mousex, mousey)
    // cannonball.body.angle = shipP.angle(mouseP)

    // cannonball.angle = Math.atan2(mousey - shipy, mousex - shipx)

    // cannonball.body.moveForward(1000)

    this.cannonball.width = this.cannonballWidth
    this.cannonball.height = this.cannonballHeight

    // this.game.p2.moveToPointer(cannonball, 100)
  }

  spreadShotLeft () {
    // Create projectile object
    console.log('o')
    let cannonball = new Test_Cannonball({
      game: this.game,
      x: this.playerMP.x,
      y: this.playerMP.y
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: this.playerMP.x,
      y: this.playerMP.y - 7.5
    })
    // Add sprite to the projectile physics group
    this.projectile.add(this.cannonball)
    this.projectile.add(this.cannonball2)
    this.projectile.add(this.cannonball3)

    // Set hitbox size for projectile
    this.cannonball.body.setRectangle(2, 2)
    this.cannonball2.body.setRectangle(2, 2)
    this.cannonball3.body.setRectangle(2, 2)
    // Tell cannonball to use cannonballCollisionGroup
    this.cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    this.cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    this.cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

    //  Cannonballs will collide against themselves and the player
    //  If this is not set, cannonballs will not collide with anything
    // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 10
    this.cannonballHeight = 20

    // Set cannonball angle, velocity, and size
    this.cannonball.body.angle = this.playerMP.angle - 90
    this.cannonball.body.moveForward(500)
    this.cannonball.width = this.cannonballWidth
    this.cannonball.height = this.cannonballHeight

    // cannonball2.x = this.playerMP.angle + 100
    // cannonball2.y = this.playerMP.angle + 100
    this.cannonball2.body.angle = this.playerMP.angle - 90
    this.cannonball2.body.moveForward(500)
    this.cannonball2.width = this.cannonballWidth
    this.cannonball2.height = this.cannonballHeight

    // cannonball3.x = this.playerMP.angle - 100
    // cannonball3.y = this.playerMP.angle - 100
    this.cannonball3.body.angle = this.playerMP.angle - 90
    this.cannonball3.body.moveForward(500)
    this.cannonball3.width = this.cannonballWidth
    this.cannonball3.height = this.cannonballHeight
  }

  spreadShotRight () {
    // Create projectile object
    console.log('o')
    let cannonball = new Test_Cannonball({
      game: this.game,
      x: this.playerMP.x,
      y: this.playerMP.y
    })
    let cannonball2 = new Test_Cannonball({
      game: this.game,
      x: this.playerMP.x,
      y: this.playerMP.y + 7.5
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: this.playerMP.x,
      y: this.playerMP.y - 7.5
    })
    // Add sprite to the projectile physics group
    this.projectile.add(this.cannonball)
    this.projectile.add(this.cannonball2)
    this.projectile.add(this.cannonball3)

    // Set hitbox size for projectile
    this.cannonball.body.setRectangle(2, 2)
    this.cannonball2.body.setRectangle(2, 2)
    this.cannonball3.body.setRectangle(2, 2)
    // Tell cannonball to use cannonballCollisionGroup
    this.cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    this.cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    this.cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

    //  Cannonballs will collide against themselves and the player
    //  If this is not set, cannonballs will not collide with anything
    // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 10
    this.cannonballHeight = 20

    // Set cannonball angle, velocity, and size
    this.cannonball.body.angle = this.playerMP.angle + 90
    this.cannonball.body.moveForward(500)
    this.cannonball.width = this.cannonballWidth
    this.cannonball.height = this.cannonballHeight

    // cannonball2.x = this.playerMP.angle + 10
    // cannonball2.y = this.playerMP.angle + 10
    this.cannonball2.body.angle = this.playerMP.angle + 90
    this.cannonball2.body.moveForward(500)
    this.cannonball2.width = this.cannonballWidth
    this.cannonball2.height = this.cannonballHeight

    // cannonball3.x = this.playerMP.angle + 10
    // cannonball3.y = this.playerMP.angle + 10
    this.cannonball3.body.angle = this.playerMP.angle + 90
    this.cannonball3.body.moveForward(500)
    this.cannonball3.width = this.cannonballWidth
    this.cannonball3.height = this.cannonballHeight
  }

  destroy () {
    this.body.sprite.kill()
    this.body.destroy()
  }

  update () {
    super.update()
  }

  setupAnimations () {
    this.animations.add('ball', [3], 60, true)
    this.animations.play('ball')
    // this.frame = 2
    console.log('k')
  }
}

export default Test_Cannonball
