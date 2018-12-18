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

    this.game.time.events.add(Phaser.Timer.SECOND * 0.50, this.noncontact, this)
    this.setupAnimations()

    // this.body.collides([this.game.enemyGroup, this.game.landGroup], this.hitCannonball)
    this.body.setCollisionGroup(this.game.cannonballCollisionGroup)
    this.body.collides([this.game.enemyGroup, this.game.landGroup])

    this.bodyShape = this.body.data.shapes[0]
    this.bodyShape.sensor = true
    this.damage = 5

    // Call the contact function when cannonballs collide with another object
    this.body.onBeginContact.add(this.contact, this)

    // Delete the cannonball hitbox and sprite after animations are done
    this.explosionAnim.onComplete.add(this.death, this)
    this.splooshAnim.onComplete.add(this.death, this)

    // Determine if cannonballs are colliding with an object or not
    this.hasHit = false
    this.enemyCheck = false
  }

  // If the cannonballs are colliding w/ an object, play the explosion animation
  contact (otherBody, otherP2Body, myShape, otherShape, contactEQ) {
    // console.log(`hit: ${otherBody.sprite.name}`)
    if (otherBody !== null && otherBody.sprite.name === 'Enemy') {
      this.enemyCheck = otherBody.sprite.getInvincible()
      if (!this.enemyCheck) {
        this.game.camera.shake(0.001, 200)
        this.game.sounds.play('getHit', config.SFX_VOLUME)
        if ((otherBody.sprite.health -= this.damage) <= 0) {
          otherBody.sprite.health = 0
        } else {
          otherBody.sprite.health -= this.damage
        }
      }
    }
    this.hasHit = true
    this.explosionAnim.play()
    this.width = 30
    this.height = 30
    this.body.velocity.x = 0
    this.body.velocity.y = 0
  }

  // After a certain amount of time, if the cannonballs have not collided with anything, play the sploosh animation
  noncontact () {
    if (!this.hasHit) {
      
      this.splooshAnim.play()
      this.width = 30
      this.height = 30
      this.body.velocity.x = 0
      this.body.velocity.y = 0
    }
  }

  // Delete cannonballs
  death () {
    this.destroy()
  }

  update () {
    super.update()
  }

  setupAnimations () {
    this.animations.add('ball', [26], 5, true)
    this.animations.play('ball')
    this.explosionAnim = this.animations.add('explosion', [35, 29, 23, 17, 11, 5], 5, false)
    this.splooshAnim = this.animations.add('sploosh', [34, 28, 22, 16, 10, 4], 5, false)
  }

  hitCannonball (cannonball, enemy) {
    cannonball.sprite.destroy()
    // enemy.sprite.destroy()
  }
}

export default Test_Cannonball
