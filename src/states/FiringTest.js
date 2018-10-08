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

    // //  Create our collision groups. One for the player, one for the sea serpents
    // var playerCollisionGroup = this.game.physics.p2.createCollisionGroup();
    // var seaSerpentCollisionGroup = this.game.physics.p2.createCollisionGroup();

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    // game.physics.p2.updateBoundsCollisionGroup();

    // loads sea snake sprite for use in the create function?
    // create 20 sea snakes on top of each other
    // what do the two 64 parameters do for the image function?
    // this.game.load.image('sea_snake_16x', './assets/images/seasnake_16x.png', 64, 64)
    // var seasnakes
    // // do not use physiscsGroup?
    // // seasnakes = this.game.add.physicsGroup()
    // seasnakes = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    // seasnakes.createMultiple(20, 'sea_snake_16x', 0, true)
    
    // attempt to add velocity to the 20 spawned dargons
    // var i
    // var j
    // for (i = 0; i < 20; i++) {
    //   for (j = 1000; j > 500; j - 25) {
    //     seasnakes[i].body.velocity.x = j
    //   }
    // }

    // create the player object and setup the camera and inputs
    this.player = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })

    // attempt to make testCannonball version?
    // this.player = new Test_Cannonballs({
    //   game: this.game,
    //   x: 500,
    //   y: 500
    // })

    // //  Create our collision groups. One for the player, one for the sea serpents
    // var playerCollisionGroup = this.game.physics.p2.createCollisionGroup()
    // var seasnakesCollisionGroup = this.game.physics.p2.createCollisionGroup()

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    this.game.physics.p2.updateBoundsCollisionGroup()

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
      // create the player object and setup the camera and inputs
      // this.game.load.image('sea_snake_16x', './assets/images/seasnake_16x.png', 64, 64)
      let cannonball = new Test_Cannonball({
        game: this.game,
        x: localPlayer.x,
        y: localPlayer.y
      })
      let projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
      // let projectile = cannonballTest.create(localPlayer.x, localPlayer.y, 'sea_snake_16x')
      projectile.add(cannonball)
      cannonball.body.velocity.x = 1000
      cannonball.width = cannonballWidth
      cannonball.height = cannonballHeight
      // this.game.add.existing(cannonball)
      
    })

    // test code
    // create a dargon for every mouse click and give it an initial velocity in the x direction
    // this.game.input.mouse.capture = true

    // // mouse click 1
    // addEventListener('click', function () {
    //   console.log(this.player)
    //   console.log(localPlayer)
    //   let projectileWidth = 100
    //   let projectileHeight = 200
    //   // let projectile = seasnakes.create(localPlayer.x - (projectileWidth / 2), localPlayer.y - (projectileHeight / 2), 'sea_snake_16x')
    //   let projectile = seasnakes.create(localPlayer.x, localPlayer.y, 'sea_snake_16x')
    //   projectile.width = projectileWidth
    //   projectile.height = projectileHeight

    //   seasnakes.body.setRectangle(40, 40)

    //   //  Tell the panda to use the pandaCollisionGroup
    //   seasnakes.body.setCollisionGroup(seasnakesCollisionGroup)

    //   //  Pandas will collide against themselves and the player
    //   //  If you don't set this they'll not collide with anything.
    //   //  The first parameter is either an array or a single collision group.
    //   seasnakes.body.collides([seasnakesCollisionGroup, playerCollisionGroup])

    //   // projectile.body.velocity.x = 1000
    //   // projectile.body.velocity.y = 0

    //   // the line of code below is supposed to do the same thing as the vector equation function
    //   // projectile.body.angle = localPlayer.angle
    //   // projectile.body.moveForward(10)
    //   // the line of code below is to test print code
    //   console.log(projectile.body)

    //   // the multiple lines of code are suppose to set the projectile to face the direction of movement
    //   // ideally, the lines of code are supposed to be in a function outside of the create function
    //   // var u_xVector = 1
    //   // var u_yVector = 0
    //   // var v_xVector = projectile.body.velocity.x
    //   // var v_yVector = projectile.body.velocity.y

    //   // var cosTheta = (u_xVector*v_xVector+u_yVector*v_yVector) /
    //   // ((Math.sqrt(u_xVector*u_xVector+u_yVector*u_yVector)) * (Math.sqrt(v_xVector*v_xVector+v_yVector*v_yVector)))

    //   // var theta = Math.acos(cosTheta)
    //   // projectile.angle = theta

    //   // projectile.body.velocity.x = 1000
    //   // projectile.body.velocity.y = 0

    //   // below is an unknown line of code found in the Phaser example, rat attack?
    //   // y += 48;
    //   console.log('o')
    // })
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
  // angleBetweenVectors (u_xVector, v_xVector, u_yVector, v_yVector) {
  //   var cosTheta = (u_xVector*v_xVector+u_yVector*v_yVector) /
  //   ((Math.sqrt(u_xVector*u_xVector+u_yVector*u_yVector)) * (Math.sqrt(v_xVector*v_xVector+v_yVector*v_yVector)))

  //   var theta = Math.acos(cosTheta)
  //   return theta
  // }
}

// Expose the class FiringTest to other files
export default FiringTest
