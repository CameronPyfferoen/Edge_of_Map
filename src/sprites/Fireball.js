import Phaser from 'phaser'
import { sequentialNumArray } from '../utils'
import config from '../config'

class Fireball extends Phaser.Sprite {
  constructor ({ game, x, y, angle }) {
    super(game, x, y, 'fireball', 0)
    this.game = game
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
    this.body.angle = this.angle
    this.body.debug = __DEV__
    this.body.collideWorldBounds = true

    this.body.setCollisionGroup(this.game.projectileGroup)

    this.body.setRectangleFromSprite()
    this.body.offset.setTo(0, 0)

    this.body.damping = 0
    this.body.data.gravityScale = 0

    this.setupAnimations()

    this.speed = 30
    this.damage = 15
    this.fire = false
  }

  end () {
    this.destroy()
    console.log('fireball destroyed')
  }

  setupAnimations () {
    this.animations.add('fire', sequentialNumArray(0, 8), true)
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
    this.body.collides(this.game.playerGroup, this.end(), this)
  }
}

export default Fireball
