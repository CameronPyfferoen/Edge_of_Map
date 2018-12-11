import Phaser from 'phaser'
import config from '../config'
import { sequentialNumArray } from '../utils.js'

class GoldDrop extends Phaser.Sprite {
  constructor ({ game, x, y }) {
    super(game, x, y, 'pickups', 0)
    this.anchor.setTo(0.5, 0.5)
    this.smoothed = false
    this.game = game

    this.game.physics.p2.enable(this)
    this.body.clearShapes()
    this.body.addCircle(12)
    this._SCALE = config.PLAYER_SCALE * 0.5
    this.scale.setTo(this._SCALE)

    this.name = 'GoldDrop'

    // this.game.debug.body(this)
    this.body.debug = __DEV__
    this.body.collideWorldBounds = true

    this.body.setCollisionGroup(this.game.itemGroup)
    this.body.collides([this.game.playerGroup, this.game.landGroup])

    this.body.damping = 0
    this.body.angularDamping = 0
    this.body.fixedRotation = true
    this.body.data.gravityScale = 0

    this.bodyShape = this.body.data.shapes[0]
    this.bodyShape.sensor = true

    this.body.onBeginContact.add(this.contact, this)

    this.setupAnimations()
    this.spawnAnim.play()
    this.spawnAnim.onComplete.add(this.idle, this)

  }

  update () {
    super.update()
  }

  contact (otherBody, otherP2Body, myShape, otherShape, contactEQ) {
    if (otherBody !== null && otherBody.sprite.name === 'Player Ship') {
      this.game.gold += 25;
      this.destroy()
    }
  }

  idle () {
    this.idleAnim.play();
  }
  setupAnimations () {
    this.spawnAnim = this.animations.add('spawn', [50, 51, 52, 53, 54], 5, false)
    this.idleAnim = this.animations.add('idle', [55, 56, 57, 58, 59], 5, true)
    // this.animations.add('test', [0, 1, 2, 3, 4], 10, true)
  }
}
export default GoldDrop
