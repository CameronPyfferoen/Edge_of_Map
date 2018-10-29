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

    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this)
    this.body.debug = __DEV__
    this.body.collideWorldBounds = true

    this.body.setRectangle(64 * config.PLAYER_SCALE, 64 * config.PLAYER_SCALE, 0, 0)
    this.body.offset.setTo(0, 0)

    this.body.damping = 0.5
    this.body.data.gravityScale = 0

    this.setupAnimations()

    this.timer = Phaser.Timer(this.game, false)
    this.timer.second = 1
    this.timer.start()

    this.speed = 30
    this.damage = 15
  }

  end () {
    this.body.destroy()
    this.destroy()
  }

  setupAnimations () {
    this.animations.add('fire', sequentialNumArray(0, 8), true)
  }

  update () {
    this.animations.play('fire')
    if(this.timer <= 0)
    {
      this.timer.destroy()
      this.end()
    }
  }
}

export default Fireball
