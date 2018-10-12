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
// Projectiles fire from the right side of the player's ship
// Projectiles face the direction they are travelling in

// What I want to do
// add a cooldown to firing projectiles
// delete the projectile sprite after a certain distance

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

    


    this.game.add.existing(this.player)
    this.setupKeyboard()
    this.game.camera.scale.x = 0.5
    this.game.camera.scale.y = 0.5
    this.game.camera.follow(this.player)

    //this.localPlayer = this.player

    

    //  Turn on impact events for the world, without this we get no collision callbacks
    this.game.physics.p2.setImpactEvents(true)

    this.playerCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.cannonballCollisionGroup = this.game.physics.p2.createCollisionGroup()
    
    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    this.localCannonballCollisionGroup = this.cannonballCollisionGroup
    this.localPlayerCollisionGroup = this.playerCollisionGroup

    //  This part is vital if you want the objects with their own collision groups to still collide with the world bounds
    //  (which we do) - what this does is adjust the bounds to use its own collision group.
    this.game.physics.p2.updateBoundsCollisionGroup()


    this.cannonballWidth = 100
    this.cannonballHeight = 200
    this.game.input.mouse.capture = true
    // replaced anon function w/ firingCallback function
    // used this.firingCallback to read the function from below the create function
    // added .bind(this) afterwards, so that, every this inside of the firingCallback function, refers to the FiringTest class rather than...
    // the addEventListener class
    // everytime I want to create an addEventListener, I should create a non-anon function below create(), and use .bind(this)
    addEventListener('click', this.firingCallback.bind(this))
    // this.game.time.events.add(Phaser.Timer.SECOND * 4, destroy)

    //  Set the ships collision group
    // is the first part of the code correct?
    this.player.body.setCollisionGroup(this.playerCollisionGroup)

    //  The ship will collide with the pandas, and when it strikes one the hitPanda callback will fire, causing it to alpha out a bit
    //  When pandas collide with each other, nothing happens to them.
    this.player.body.collides(this.cannonballCollisionGroup, this.hitCannonball, this)



    

  }

  // destroy () {
  //   this.cannonball.destroy()
  // }

  hitCannonball (body1, body2) {
    //  body1 is the space ship (as it's the body that owns the callback)
    //  body2 is the body it impacted with, in this case our panda
    //  As body2 is a Phaser.Physics.P2.Body object, you access its own (the sprite) via the sprite property:
    // body2.sprite.alpha -= 0.1
    body2.sprite.kill()
    // for some reason, the line of code below, relating to destory, causes the game to crash after the player collides with the projectile
    // body2.destroy()
  }

  firingCallback () {
    
      console.log('o')
      let cannonball = new Test_Cannonball({
        game: this.game,
        x: this.player.x + 100,
        y: this.player.y
      })
      
      this.projectile.add(cannonball)

      
      cannonball.body.setRectangle(4, 4)
      //  Tell the panda to use the cannonballCollisionGroup
      cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)
      //  Pandas will collide against themselves and the player
      //  If you don't set this they'll not collide with anything.
      //  The first parameter is either an array or a single collision group.
      
      cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

      cannonball.body.angle = this.player.angle + 90
      cannonball.width = this.cannonballWidth
      cannonball.height = this.cannonballHeight
      cannonball.body.moveForward(1000)



      // // PoS code below is supposed to delete cannonball sprite after a certain amount of distance?
      // cannonball.distanceConstraint(this.game, localPlayer, null, 10, null, null, null)
      // if (cannonball.distanceConstraint(this.game, localPlayer, null, 10, null, null, null)) {
      //   cannonball.destroy()
      // }

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

      // // below is an unknown line of code
      // cannonball.body.setRectangle(40, 40)



      // // COLLISION
      // // the two sets of commented code below relate to collision
      // //  Tell the panda to use the pandaCollisionGroup
      // cannonball.body.setCollisionGroup(cannonballCollisionGroup)

      // //  Pandas will collide against themselves and the player
      // //  If you don't set this they'll not collide with anything.
      // //  The first parameter is either an array or a single collision group.
      // cannonball.body.collides([cannonballCollisionGroup, playerCollisionGroup])
      
    
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
