// Import the entire 'phaser' namespace
import Phaser from 'phaser'
// Import config settings
import config from '../config'

// Import the player boat
import PlayerBoat from '../sprites/PlayerBoat'
import Test_Snek from '../sprites/Test_Snek'
import Test_Cannonball from '../sprites/Test_Cannonball'
import { Sprite } from 'phaser-ce'

// GameData
import GameData from '../GameData'

// What I did previously
// Integrated shooting from PlayerBoat to Cam_TestLevel(the main game)

// What I want to do
// harpoon projectile!!!
// figure out how to replace kill cannonball w/ destroy cannonball
// look at Eliot's link on Slack
// add more comments to large commented code below
// consider adding --- lines to comments for readability
// change hitbox position

// Phaser examples to look at
// ...

class FiringTest extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.add.tileSprite(0, 0, 3149, 2007, 'map')
    this.game.world.setBounds(0, 0, 3149, 2007)
  }

  preload () {
    // Load sprites, specifically the sea snake sprite for projectiles
    // this.game.load.image('sea_snake_16x', './assets/images/seasnake_16x.png', 64, 64)
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
    this.game.camera.scale.x = 4.2
    this.game.camera.scale.y = 4.2
    this.game.camera.follow(this.player)

    // Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true)

    // Create collision groups for player and projectile
    // Consider creating collision groups for enemy AI
    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.cannonballCollisionGroup = this.game.physics.p2.createCollisionGroup()

    // add the two lines of code below?
    // Set the ships collision group
    this.player.body.setCollisionGroup(this.playerCollisionGroup)

    // Add p2 physics group to this.projectile
    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)

    // Objects with collision groups will collide with world bounds
    // this.game.physics.p2.updateBoundsCollisionGroup()

    // prevent the right mouse button click menu from popping up
    this.game.input.mouse.capture = true
    document.oncontextmenu = function () {
      return false
    }

    // replaced anon function w/ firingCallback function
    // used this.firingCallback to read the function from below the create function
    // added .bind(this) afterwards, so that, every this inside of the firingCallback function, refers to the FiringTest class rather than...
    // the addEventListener class
    // every time I want to create an addEventListener, I should create a non-anon function below create(), and use .bind(this)...
    // or if I want to create anything similar to addEventListener
    // addEventListener('click', this.firingCallback.bind(this))
    addEventListener('click', this.player.firingCallback.bind(this.player))
    addEventListener('contextmenu', this.player.firingCallback2.bind(this.player))
    // addEventListener('click', this.firingCallback.bind(this))
    // addEventListener('contextmenu', this.firingCallback2.bind(this))

    // Look at callback function notes
    // When the ship collides with projectiles, the hitCannonball callback is called, killing the projectiles
    // When projectiles collide with each other, they are not killed
    this.player.body.collides(this.cannonballCollisionGroup, this.hitCannonball, this)

    // timer variables for firing rate
    this.timer = 0
    this.timer2 = 0

    this.sneks = []
    for (let i = 0; i < 10; i++) {
      this.sneks[i] = new Test_Snek({
        game: this.game,
        x: Phaser.Math.random(0, 3149),
        y: Phaser.Math.random(0, 2007),
        player: this.playerMP
      })

      this.game.add.existing(this.sneks[i])
    }

  }

  // LARGE CODE MOVED TO PLAYERBOAT FOR EFFICIENCY
  // // Delete projectiles after x amount of seconds or collision
  // hitCannonball (body1, body2) {
  //   // body1 is the ship (as it's the body that owns the callback)
  //   // body2 is the body it impacted with, in this case projectiles

  //   // body2.sprite.kill()
  //   // for some reason, the line of code below, relating to destory, causes the game to crash after the player collides with the projectile
  //   body2.destroy()
  // }

  // // Choose projectile type for the left side of the ship
  // firingCallback () {
  //   switch (this.player.shotType) {
  //     case GameData.shotTypes.HARPOON:
  //       this.harpoon()
  //       break
  //     case GameData.shotTypes.MULTISHOT:
  //       this.spreadShotLeft()
  //       break
  //     case GameData.shotTypes.EXTRA:
  //       //
  //       break
  //     default:
  //   }
  //   // this.spreadShotLeft()
  //   // this.harpoon()
  // }

  // // Choose projectile type for the right side of the ship
  // firingCallback2 () {
  //   // this.spreadShotRight()
  // }

  // // Firing rate for the left side of the ship
  // firingCallbackCooldown () {
  //   if (this.timer == 0) {
  //     this.firingCallback()
  //     this.timer = 4000
  //     while (this.timer > 0) {
  //       this.timer--
  //     }
  //   }
  // }

  // // Firing rate for the right side of the ship
  // firingCallbackCooldown2 () {
  //   if (this.timer2 == 0) {
  //     this.firingCallback2()
  //     this.timer2 = 4000
  //     while (this.timer2 > 0) {
  //       this.timer2--
  //     }
  //   }
  // }

  // harpoon () {
  //   console.log('o')
  //   let mousex = this.game.input.x
  //   let mousey = this.game.input.y
  //   console.log('MousePos: [' + mousex + ',' + mousey + ']')
  //   let shipx = this.player.x / 2
  //   let shipy = this.player.y / 2
  //   console.log('ShipPos: [' + shipx + ',' + shipy + ']')
  //   let directionx = mousex - shipx
  //   let directiony = mousey - shipy
  //   let magnitude = Math.sqrt(((Math.pow(directionx, 2)) + (Math.pow(directiony, 2))))
  //   let unitx = directionx / magnitude
  //   let unity = directiony / magnitude
  //   let harpoonAngle = (Math.atan(directiony / directionx) * (180 / Math.PI) )
  //   console.log('DIRECTION: [' + directionx + ',' + directiony + ']')
  //   let cannonball = new Test_Cannonball({
  //     game: this.game,
  //     x: this.player.x,
  //     y: this.player.y
  //   })

  //   this.projectile.add(cannonball)
  //   cannonball.body.setRectangle(2, 2)
  //   cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)

  //   this.cannonballWidth = 10
  //   this.cannonballHeight = 20

  //   if (harpoonAngle > 0) {
  //     cannonball.body.angle = harpoonAngle - 90
  //   }
  //   else {
  //     cannonball.body.angle = harpoonAngle + 90
  //   }

  //   cannonball.body.velocity.x = unitx * 50
  //   cannonball.body.velocity.y = unity * 50

  //   console.log(harpoonAngle)


  //   // let shipP = new Phaser.Point(shipx, shipy)
  //   // let mouseP = new Phaser.Point(mousex, mousey)
  //   // cannonball.body.angle = shipP.angle(mouseP)

  //   // cannonball.angle = Math.atan2(mousey - shipy, mousex - shipx)

  //   // cannonball.body.moveForward(1000)


  //   cannonball.width = this.cannonballWidth
  //   cannonball.height = this.cannonballHeight

  //   // this.game.p2.moveToPointer(cannonball, 100)
  // }

  // spreadShotLeft () {
  //   // Create projectile object
  //   console.log('o')
  //   let cannonball = new Test_Cannonball({
  //     game: this.game,
  //     x: this.player.x,
  //     y: this.player.y
  //   })
  //   let cannonball2 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.player.x,
  //     y: this.player.y + 7.5
  //   })
  //   let cannonball3 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.player.x,
  //     y: this.player.y - 7.5
  //   })
  //   // Add sprite to the projectile physics group
  //   this.projectile.add(cannonball)
  //   this.projectile.add(cannonball2)
  //   this.projectile.add(cannonball3)

  //   // Set hitbox size for projectile
  //   cannonball.body.setRectangle(2, 2)
  //   cannonball2.body.setRectangle(2, 2)
  //   cannonball3.body.setRectangle(2, 2)
  //   // Tell cannonball to use cannonballCollisionGroup
  //   cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)
  //   cannonball2.body.setCollisionGroup(this.cannonballCollisionGroup)
  //   cannonball3.body.setCollisionGroup(this.cannonballCollisionGroup)

  //   //  Cannonballs will collide against themselves and the player
  //   //  If this is not set, cannonballs will not collide with anything
  //   // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

  //   // Set projectile sprite size, spawn location, and velocity
  //   this.cannonballWidth = 10
  //   this.cannonballHeight = 20

  //   // Set cannonball angle, velocity, and size
  //   cannonball.body.angle = this.player.angle - 90
  //   cannonball.body.moveForward(50)
  //   cannonball.width = this.cannonballWidth
  //   cannonball.height = this.cannonballHeight

  //   // cannonball2.x = this.player.angle + 100
  //   // cannonball2.y = this.player.angle + 100
  //   cannonball2.body.angle = this.player.angle - 90
  //   cannonball2.body.moveForward(50)
  //   cannonball2.width = this.cannonballWidth
  //   cannonball2.height = this.cannonballHeight

  //   // cannonball3.x = this.player.angle - 100
  //   // cannonball3.y = this.player.angle - 100
  //   cannonball3.body.angle = this.player.angle - 90
  //   cannonball3.body.moveForward(50)
  //   cannonball3.width = this.cannonballWidth
  //   cannonball3.height = this.cannonballHeight
  // }

  // spreadShotRight () {
  //   // Create projectile object
  //   console.log('o')
  //   let cannonball = new Test_Cannonball({
  //     game: this.game,
  //     x: this.player.x,
  //     y: this.player.y
  //   })
  //   let cannonball2 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.player.x,
  //     y: this.player.y + 7.5
  //   })
  //   let cannonball3 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.player.x,
  //     y: this.player.y - 7.5
  //   })
  //   // Add sprite to the projectile physics group
  //   this.projectile.add(cannonball)
  //   this.projectile.add(cannonball2)
  //   this.projectile.add(cannonball3)

  //   // Set hitbox size for projectile
  //   cannonball.body.setRectangle(2, 2)
  //   cannonball2.body.setRectangle(2, 2)
  //   cannonball3.body.setRectangle(2, 2)
  //   // Tell cannonball to use cannonballCollisionGroup
  //   cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)
  //   cannonball2.body.setCollisionGroup(this.cannonballCollisionGroup)
  //   cannonball3.body.setCollisionGroup(this.cannonballCollisionGroup)

  //   //  Cannonballs will collide against themselves and the player
  //   //  If this is not set, cannonballs will not collide with anything
  //   // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

  //   // Set projectile sprite size, spawn location, and velocity
  //   this.cannonballWidth = 10
  //   this.cannonballHeight = 20

  //   // Set cannonball angle, velocity, and size
  //   cannonball.body.angle = this.player.angle + 90
  //   cannonball.body.moveForward(50)
  //   cannonball.width = this.cannonballWidth
  //   cannonball.height = this.cannonballHeight

  //   // cannonball2.x = this.player.angle + 10
  //   // cannonball2.y = this.player.angle + 10
  //   cannonball2.body.angle = this.player.angle + 90
  //   cannonball2.body.moveForward(50)
  //   cannonball2.width = this.cannonballWidth
  //   cannonball2.height = this.cannonballHeight

  //   // cannonball3.x = this.player.angle + 10
  //   // cannonball3.y = this.player.angle + 10
  //   cannonball3.body.angle = this.player.angle + 90
  //   cannonball3.body.moveForward(50)
  //   cannonball3.width = this.cannonballWidth
  //   cannonball3.height = this.cannonballHeight
  // }

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
