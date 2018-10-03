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
    this.game.camera.scale.x = 0.5
    this.game.camera.scale.y = 0.5
    this.game.camera.follow(this.player)



    var localPlayer = this.player

    // test code
    // create a dragon for every mouse click and give it an initial velocity in the x direction
    this.game.input.mouse.capture = true
    // var projectile
    addEventListener('click', function () {
      console.log(this.player)
      console.log(localPlayer)
      var projectileWidth = 100
      var projectileHeight = 200
      var projectile = seasnakes.create(localPlayer.x - (projectileWidth / 2), localPlayer.y - (projectileHeight / 2), 'sea_snake_16x')
      projectile.width = projectileWidth
      projectile.height = projectileHeight


    //   the multiple lines of code are suppose to set the projectile to face the direction of movement
    //   projectile.body.velocity.x = 1000

    //   var u_xVector = projectile.body.velocity.x
    //   var u_yVector = projectile.body.velocity.y
    //   var v_xVector = 1
    //   var v_yVector = 0

    //   var cosTheta = (u_xVector*v_xVector+u_yVector*v_yVector) /
    // ((Math.sqrt(u_xVector*u_xVector+u_yVector*u_yVector)) * (Math.sqrt(v_xVector*v_xVector+v_yVector*v_yVector)))

    //   var theta = Math.acos(cosTheta)
    //   projectile.angle = theta


      
      // projectile.body.velocity.x = 1000
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

  // attempted to create a function to set the face of the projectile in the direction of the velocity
  angleBetweenVectors (u_xVector, v_xVector, u_yVector, v_yVector) {
    var cosTheta = (u_xVector*v_xVector+u_yVector*v_yVector) /
    ((Math.sqrt(u_xVector*u_xVector+u_yVector*u_yVector)) * (Math.sqrt(v_xVector*v_xVector+v_yVector*v_yVector)))

    var theta = Math.acos(cosTheta)
    return theta
  }

}

// Expose the class FiringTest to other files
export default FiringTest
