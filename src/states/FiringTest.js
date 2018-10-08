// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import config settings
import config from '../config'

// Import the player boat
import PlayerBoat from '../sprites/PlayerBoat'
import Test_Cannonball from '../sprites/Test_Cannonball'
import { Sprite } from 'phaser-ce'

// What I did previously
// Gave spawned objects an initial velocity
// Spawned object at player's location via mouse click
// Spawned object at the center of object rather than at the origin
// Attempted to create a function to make the projectile face the direction it is travelling

// What I want to do
// Complete the projectile direction function

// Phaser examples to look at
// Consider looking at rat attack in create in phaser
// Consider looking at multiball in arcade physics

class FiringTest extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.add.tileSprite(0, 0, 3149, 2007, 'map')
    this.game.world.setBounds(0, 0, 3149, 2007)
  }

  preload () {
    this.game.load.image('sea_snake_16x', './assets/images/seasnake_16x.png', 64, 64)
  }

  create () {
    // create the player object and setup the camera and inputs
    this.player = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })

    // //  Create our collision groups. One for the player, one for the sea serpents
    // let playerCollisionGroup = this.game.physics.p2.createCollisionGroup()
    // let cannonballCollisionGroup = this.game.physics.p2.createCollisionGroup()

    // //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    // //  (which we do) - what this does is adjust the bounds to use its own collision group.
    // this.game.physics.p2.updateBoundsCollisionGroup()

    this.game.add.existing(this.player)
    this.setupKeyboard()
    this.game.camera.scale.x = 0.5
    this.game.camera.scale.y = 0.5
    this.game.camera.follow(this.player)

    let localPlayer = this.player

    let cannonballWidth = 100
    let cannonballHeight = 200
    this.game.input.mouse.capture = true
    addEventListener('click', function () {
      console.log('o')
      let cannonball = new Test_Cannonball({
        game: this.game,
        x: localPlayer.x,
        y: localPlayer.y
      })
      let projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
      projectile.add(cannonball)
      cannonball.body.angle = localPlayer.angle + 90
      cannonball.width = cannonballWidth
      cannonball.height = cannonballHeight
      cannonball.body.moveForward(10)

      // cannonball.body.setRectangle(40, 40)

      // //  Tell the panda to use the pandaCollisionGroup
      // cannonball.body.setCollisionGroup(cannonballCollisionGroup)

      // //  Pandas will collide against themselves and the player
      // //  If you don't set this they'll not collide with anything.
      // //  The first parameter is either an array or a single collision group.
      // cannonball.body.collides([cannonballCollisionGroup, playerCollisionGroup])
      
    })

    // test code
    // create a dargon for every mouse click and give it an initial velocity in the x direction
    // this.game.input.mouse.capture = true
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
