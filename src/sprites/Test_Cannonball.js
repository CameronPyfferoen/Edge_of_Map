import Phaser from 'phaser'
import config from '../config'
// import Test_Cannonball from '../sprites/Test_Cannonball'

class Test_Cannonball extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    // super(game, x, y, 'sea_snake_16x', 0)
    super(game, x, y, 'cannonball2', 0)
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

    this.body.clearShapes()
    // this.body.addRectangle(64 * config.PLAYER_SCALE, 64 * config.PLAYER_SCALE, 0, 0)
    this.body.addRectangle(2, 2, 0, -7)
    // this.body.setRectangle(2, 2, 0, -7)
    // this.body.offset.setTo(0, 0)

    this.body.damping = 0.5
    this.body.data.gravityScale = 0
    // this.body.fixedRotation = true

    this.game.time.events.add(Phaser.Timer.SECOND * 5, this.destroy.bind(this), this)
    this.setupAnimations()

    // this.body.collides([this.game.enemyGroup, this.game.landGroup], this.hitCannonball)
    this.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    this.body.collides([this.game.enemyGroup, this.game.landGroup])

    this.bodyShape = this.body.data.shapes[0]
    this.bodyShape.sensor = true
    this.damage = 5

    this.body.onBeginContact.add(this.contact, this)

    this.explosionAnim.onComplete.add(this.death, this)
  }

  contact (otherBody, otherP2Body, myShape, otherShape, contactEQ) {
    console.log(`hit: ${otherBody.sprite.name}`)
    if (otherBody !== null && otherBody.sprite.name === 'Enemy') {
      game.camera.shake(0.001, 200)
      game.getHit.play('', 0, config.SFX_VOLUME)
      if ((otherBody.sprite.health -= this.damage) <= 0) {
        otherBody.sprite.health = 0
      }
      else {
        otherBody.sprite.health -= this.damage
      }
    }
    this.explosionAnim.play()
    this.body.velocity.x = 0
    this.body.velocity.y = 0
  }

  death () {
    this.destroy()
  }

  // DELETED LARGE CHUNK OF CODE, IT DID NOT BELONG

  update () {
    super.update()
  }

  setupAnimations () {
    this.animations.add('ball', [12], 60, true)
    this.animations.play('ball')
    this.explosionAnim = this.animations.add('explosion', [30, 31, 32, 33, 34, 35], 5, false)
    // this.frame = 2
    // console.log('k')
  }

  hitCannonball (cannonball, enemy) {
    // body1 is the ship (as it's the body that owns the callback)
    // body2 is the body it impacted with, in this case projectiles

    cannonball.sprite.destroy()
    // enemy.sprite.destroy()
  }
}

export default Test_Cannonball
