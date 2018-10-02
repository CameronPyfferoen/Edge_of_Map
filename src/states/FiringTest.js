// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import config settings
import config from '../config'

// Import the player boat
import PlayerBoat from '../sprites/PlayerBoat'
import { Sprite } from 'phaser-ce'

// What I want to do next time
// Randomly spawn cannonballs on the map
// If ship travels over cannonball, change the color of it to show damage?
// Work on collision?
// Consider looking at rat attack in create in phaser
// Consider looking at multiball in arcade physics

class FiringTest extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.add.tileSprite(0, 0, 3149, 2007, 'map')
    this.game.world.setBounds(0, 0, 3149, 2007)
  }

  preload () {}

  create () {
    // below, in the comments, is a line of random test code
    // this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.game.load.image('sea_snake_16x', './assets/images/seasnake_16x.png', 64, 64)
    var seasnakes
    seasnakes = this.game.add.physicsGroup()
    seasnakes.createMultiple(20, 'sea_snake_16x', 0, true)

    // create the player object and setup the camera and inputs
    this.player = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })
    this.game.add.existing(this.player)
    this.setupKeyboard()
    // frame of the game
    // change size later
    this.game.camera.scale.x = 0.1
    this.game.camera.scale.y = 0.1
    this.game.camera.follow(this.player)

    // test code
    // create a dragon for every mouse click and give it an initial velocity in the x direction
    this.game.input.mouse.capture = true
    var seasnake
    addEventListener('click', function () {
      seasnakes.create(this.game.world.randomX, this.game.world.randomY, 'sea_snake_16x')
      // the line below is incorrect for some reason
      seasnake.body.velocity.x = 1000
      // y += 48;
      console.log('o')
    })
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
