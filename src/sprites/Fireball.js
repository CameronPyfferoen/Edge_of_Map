import Phaser from 'phaser'
import { sequentialNumArray } from '../utils'
import config from '../config'

class Fireball extends Phaser.Sprite {
  constructor ({ game, x, y, angle }) {
    super(game, x, y, 'fireball', 0)
    this.name = 'Fireball'
    this.x = x
    this.y = y
    this.angle = angle

    this.startx = this.x
    this.starty = this.y

    this.travel_dist = 0
    this.destroy_dist = 150

    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this)
    this.body.clearShapes()
    this.body.addCapsule(12, 5, 0, 0, -1.55)

    this.body.angle = angle
    this.body.debug = __DEV__

    // this.game.playerGroup.add(this)

    // this.body.collideWorldBounds = true
    this.body.setCollisionGroup(this.game.projectileGroup)
    this.body.collides([this.game.playerGroup, this.game.landGroup])

    // this.body.setRectangleFromSprite()
    // this.body.offset.setTo(0, 0)

    this.body.damping = 0
    this.body.angularDamping = 0
    this.body.fixedRotation = true
    this.body.data.gravityScale = 0

    this.setupAnimations()

    this.speed = 200
    this.damage = 12.5
    this.fire = true

    // Turn into a sensor
    this.bodyShape = this.body.data.shapes[0]
    this.bodyShape.sensor = true
    this.body.onBeginContact.add(this.contact, this)
    /*
    var coll  = this.body.collidesWith
    coll.forEach(element => {
      console.log('fbireball collides with: ' + element)
    });
    */
  }

  contact (otherBody, otherP2Body, myShape, otherShape, contactEQ) {
    if (otherBody !== null && otherBody.sprite.name === 'Player Ship') {
      this.game.camera.shake(0.005, 500); // this.game is null?
      this.game.sounds.play('getHit', config.SFX_VOLUME)
      if ((otherBody.sprite.health -= this.damage) <= 0) {
        otherBody.sprite.health = 0
      } else {
        otherBody.sprite.health -= this.damage
      }
    }

    // Always destroy on contact
    this.end()
  }

  end () {
    this.fire = false
    this.destroy()
  }

  setupAnimations () {
    this.animations.add('fire', sequentialNumArray(0, 8), 10, true)
  }

  interact () {
    this.end()
  }

  update () {
    super.update()
    this.animations.play('fire')
    this.travel_dist = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    if(this.fire)
    {
      this.body.moveForward(this.speed)
    }
    if(this.travel_dist >= this.destroy_dist)
    {
      this.end()
    }
    // this.body.collides(this.game.playerGroup, this.end(), this)
  }
}

export default Fireball
