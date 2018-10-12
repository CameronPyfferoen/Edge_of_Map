import Phaser from 'phaser'
import config from '../config'

class Wake extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'wake', 0)
    this.name = 'wake'
    this.anchor.setTo(0.5, 0.5)
    this.timer = 0;
    this.game = game

    this._SCALE = config.PLAYER_SCALE
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this)

    this.body.debug = __DEV__
    this.body.collideWorldBounds = false

    this.body.setRectangle(10 * config.PLAYER_SCALE, 10 * config.PLAYER_SCALE, 0, 0)
    this.body.offset.setTo(0, 0)

    this.body.damping = 0.5
    this.body.data.gravityScale = 0
    this.setupAnimations()
    this.animations.play('idle', true)
  }

  update () {
    super.update()
    
    this.timer += 1;
    if (this.timer > 10) {
      console.log('destroyed')
      this.destroy()
    }
  }

  setupAnimations () {
    this.animations.add('idle', [0, 1, 2, 3], 10, true)
  }
}

export default Wake
