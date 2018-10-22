// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import config settings
import config from '../config'

// Import the player boat
import PlayerBoat from '../sprites/PlayerBoat'
import Test_Cannonball from '../sprites/Test_Cannonball'
import { Sprite } from 'phaser-ce'

// What I did previously
// Improved projectiles
// Projectiles are deleted after an x amount of time, or if they collide with anything
// Can fire from right side of the ship
// Removed right click context menu
// Scatter shot implemented

// What I want to do
// consider adding a sprite count, to see if sprites are deleted or not
// add a cooldown to firing projectiles
// add another set of projectiles that fire towards the mouse cursor
// SOMEWHAT IMPORTANT, figure out if I can move any code from FiringTest class into functions outside of the create function or js files in sprites
// ^IN OTHER WORDS, make code more efficient
// Check out bullet function, see if it's more efficient
// Different projectiles: Rapid Fire and Harpoons
// ^Look at Eliot's link on Slack
// Finally move Test_Cannonballs to Player file in sprites

// Phaser examples to look at
// body click in p2 physics?

class FiringTest extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.add.tileSprite(0, 0, 3149, 2007, 'map')
    this.game.world.setBounds(0, 0, 3149, 2007)
  }

  preload () {
    // Load sprites, specifically the sea snake sprite for projectiles
    this.game.load.image('sea_snake_16x', './assets/images/seasnake_16x.png', 64, 64)
  }

  create () {
    // Create the player object
    // Setup the camera and inputs
    this.player = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })

    this.game.add.existing(this.player)
    this.setupKeyboard()
    this.game.camera.scale.x = 0.5
    this.game.camera.scale.y = 0.5
    this.game.camera.follow(this.player)

    // Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true)

    // Create collision groups for player and projectile
    // Consider creating collision groups for enemy AI
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.cannonballCollisionGroup = this.game.physics.p2.createCollisionGroup()

    // Add p2 physics group to this.projectile
    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)

    // Objects with collision groups will collide with world bounds
    // Adjust the bounds to use its own collision group.
    this.game.physics.p2.updateBoundsCollisionGroup()

    this.game.input.mouse.capture = true

    // prevent the right mouse button click menu from popping up
    document.oncontextmenu = function () {
      return false
    }
    this.timer = 0
    this.timer2 = 0
    // replaced anon function w/ firingCallback function
    // used this.firingCallback to read the function from below the create function
    // added .bind(this) afterwards, so that, every this inside of the firingCallback function, refers to the FiringTest class rather than...
    // the addEventListener class
    // every time I want to create an addEventListener, I should create a non-anon function below create(), and use .bind(this)
    // or if I want to create anything similar to addEventListener
    // addEventListener('click', this.firingCallback.bind(this))
    addEventListener('click', this.firingCallbackCooldown.bind(this))
    addEventListener('contextmenu', this.firingCallbackCooldown2.bind(this))

    // Set the ships collision group
    this.player.body.setCollisionGroup(this.playerCollisionGroup)

    // Look at callback function notes
    // When the ship collides with projectiles, the hitCannonball callback is called, killing the projectiles
    // When projectiles collide with each other, they are not killed
    this.player.body.collides(this.cannonballCollisionGroup, this.hitCannonball, this)
  }

  hitCannonball (body1, body2) {
    // body1 is the ship (as it's the body that owns the callback)
    // body2 is the body it impacted with, in this case projectiles

    // CONCERN, what if the player deletes enemies when collision occurs?
    // body2 is a Phaser.Physics.P2.Body object, you can access its sprite via the sprite property?
    body2.sprite.kill()
    // for some reason, the line of code below, relating to destory, causes the game to crash after the player collides with the projectile
    // body2.destroy()
  }
  firingCallbackCooldown () {
    if (this.timer == 0) {
      this.firingCallback()
      this.timer = 4000
      while (this.timer > 0) {
        this.timer--
      }
    }
  }
  firingCallbackCooldown2 () {
    if (this.timer2 == 0) {
      this.firingCallback2()
      this.timer2 = 4000
      while (this.timer2 > 0) {
        this.timer2--
      }
    }
  }
  firingCallback () {
    // Create projectile object
    console.log('o')
    let cannonball = new Test_Cannonball({
      game: this.game,
      x: this.player.x,
      y: this.player.y
    })
    let cannonball2 = new Test_Cannonball({
      game: this.game,
      x: this.player.x,
      y: this.player.y
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: this.player.x,
      y: this.player.y
    })
    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set hitbox size for projectile
    cannonball.body.setRectangle(4, 4)
    // Tell cannonball to use cannonballCollisionGroup
    cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)

    //  Cannonballs will collide against themselves and the player
    //  If this is not set, cannonballs will not collide with anything.
    //  The first parameter is either an array or a single collision group. WHAT IS THIS LINE OF COMMENT
    // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 100
    this.cannonballHeight = 200
    cannonball.body.angle = this.player.angle - 90
    // this.game.p2.moveToPointer(cannonball, 100)
    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight
    cannonball.body.moveForward(1000)

    cannonball2.body.setRectangle(4, 4)
    cannonball2.body.setCollisionGroup(this.cannonballCollisionGroup)
    cannonball2.body.angle = this.player.angle - 45
    cannonball2.body.moveForward(1000)
    cannonball2.width = this.cannonballWidth
    cannonball2.height = this.cannonballHeight

    cannonball3.body.setRectangle(4, 4)
    cannonball3.body.setCollisionGroup(this.cannonballCollisionGroup)
    cannonball3.body.angle = this.player.angle - 135
    cannonball3.body.moveForward(1000)
    cannonball3.width = this.cannonballWidth
    cannonball3.height = this.cannonballHeight

    // // PoS code below is supposed to add a rate of fire for ship
    // // set of code below should be a function
    // // var sprite, sprite was replaced with cannonball
    // // var bullets, replaced with projectiles
    // // keep an eye out for bullet var in the if statement below
    // var fireRate = 10000
    // var nextFire = 0
    // if (this.game.time.now > nextFire && projectile.countDead() > 0) {
    //   nextFire = this.game.time.now + fireRate
    //   var bullet = projectile.getFirstDead()
    //   bullet.reset(cannonball.x - 8, cannonball.y - 8)
    //   this.game.physics.arcade.moveToPointer(bullet, 300)
    // }
  }

  firingCallback2 () {
    // Create projectile object
    console.log('o')
    let cannonball = new Test_Cannonball({
      game: this.game,
      x: this.player.x,
      y: this.player.y
    })
    let cannonball2 = new Test_Cannonball({
      game: this.game,
      x: this.player.x,
      y: this.player.y
    })
    let cannonball3 = new Test_Cannonball({
      game: this.game,
      x: this.player.x,
      y: this.player.y
    })
    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set hitbox size for projectile
    cannonball.body.setRectangle(4, 4)
    // Tell cannonball to use cannonballCollisionGroup
    cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)

    //  Cannonballs will collide against themselves and the player
    //  If this is not set, cannonballs will not collide with anything.
    //  The first parameter is either an array or a single collision group. WHAT IS THIS LINE OF COMMENT
    // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 100
    this.cannonballHeight = 200
    cannonball.body.angle = this.player.angle + 90
    // this.game.p2.moveToPointer(cannonball, 100)
    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight
    cannonball.body.moveForward(1000)

    cannonball2.body.setRectangle(4, 4)
    cannonball2.body.setCollisionGroup(this.cannonballCollisionGroup)
    cannonball2.body.angle = this.player.angle + 45
    cannonball2.body.moveForward(1000)
    cannonball2.width = this.cannonballWidth
    cannonball2.height = this.cannonballHeight

    cannonball3.body.setRectangle(4, 4)
    cannonball3.body.setCollisionGroup(this.cannonballCollisionGroup)
    cannonball3.body.angle = this.player.angle + 135
    cannonball3.body.moveForward(1000)
    cannonball3.width = this.cannonballWidth
    cannonball3.height = this.cannonballHeight

    // // PoS code below is supposed to add a rate of fire for ship
    // // set of code below should be a function
    // // var sprite, sprite was replaced with cannonball
    // // var bullets, replaced with projectiles
    // // keep an eye out for bullet var in the if statement below
    // var fireRate = 10000
    // var nextFire = 0
    // if (this.game.time.now > nextFire && projectile.countDead() > 0) {
    //   nextFire = this.game.time.now + fireRate
    //   var bullet = projectile.getFirstDead()
    //   bullet.reset(cannonball.x - 8, cannonball.y - 8)
    //   this.game.physics.arcade.moveToPointer(bullet, 300)
    // }
  }
  
  setupKeyboard () {
    // register keys
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.forward = this.game.input.keyboard.addKey(Phaser.Keyboard.UP)
    // Stop the following keys from propagating up to the browser
    this.game.input.keyboard.addKeyCapture([
      Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.UP
    ])
  }
  update () {
    // this.player.angle += 1
    // ...body.moveForward(x)
    if (this.leftKey.isDown) { this.player.body.angle -= 1 }
    if (this.rightKey.isDown) { this.player.body.angle += 1 }
    if (this.forward.isDown) { this.player.body.moveForward(75) }
    // if (this.forward.isDown) { this.player.velocityFromAngle(this.player.body.angle, 75, this.player.body.velocity) }
    else { this.player.body.angularVelocity = 0 }
  }
}

// Expose the class FiringTest to other files
export default FiringTest
