import Phaser from 'phaser'
import config from '../config'
// import Test_Cannonball from '../sprites/Test_Cannonball'

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

    this.game.time.events.add(Phaser.Timer.SECOND * 5, this.destroy.bind(this), this)
    this.setupAnimations()

    // this.body.collides([this.game.enemyGroup, this.game.cannonballCollisionGroup])
    this.body.collides(this.game.enemyGroup, this.hitCannonball, this)
  }

  // DELETED LARGE CHUNK OF CODE, IT DID NOT BELONG

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
    // console.log('k')
  }

  hitCannonball (body1, body2) {
    // body1 is the ship (as it's the body that owns the callback)
    // body2 is the body it impacted with, in this case projectiles

    body2.sprite.kill()
    // for some reason, the line of code below, relating to destory, causes the game to crash after the player collides with the projectile
    console.log('TEST')
    // body2.destroy()
  }
}

export default Test_Cannonball
