import Phaser from 'phaser'
import config from '../config'

class Enemy extends Phaser.Sprite
{
  constructor ({ game, x, y, player }) {
    super(game, x, y, 'seasnake', 0)
    this.name = 'Enemy'
    this.player = player
    this.anchor.setTo(0.5, 0.5)
    this.maxHealth = 100
    this.smoothed = true

    this.game = game
    console.log('Enemies created')
    // console.log('Player: ' + this.player)

    this._SCALE = 0.4
    this.scale.setTo(this._SCALE)

    this.game.physics.p2.enable(this)
    this.body.setCollisionGroup(this.game.enemyGroup)
    this.body.collides([this.game.playerGroup, this.game.landGroup, this.game.cannonballCollisionGroup])

    this.body.debug = __DEV__
    this.body.colliderWorldBounds = false

    // this.body.setRectangleFromSprite()
    // this.body.offset.setTo(0.5, 1.5)

    this.body.damping = 0.5
    this.body.data.gravityScale = 0

    // this.autocull = true;
    this.isOffCamera = false

    this.player_dist = 1000000
    this.pat_dist = 200
    this.start_diff = 0
    this.chase_dist = 200
    this.renderdist = 700

    this.fwdspd = 20
    this.turnspd = 10
    this.angspd = 0.8
    this.chasespd = 30

    this.startx = this.body.x
    this.starty = this.body.y
    this.startang = this.body.angle
    this.turn = false
    this.setupAnimations()
  }

  patrol () {
    this.animations.play('swim')
    if (!this.turn) {
      this.body.moveForward(this.fwdspd)
      if (this.pat_dist <= this.start_diff) {
        this.turn = true
      }
    }
    else if (this.turn) {
      this.body.angle += this.angspd
      this.body.moveForward(this.turnspd)
      if ((this.body.angle >= this.startang + 175 && this.body.angle <= this.startang + 180 ) || (this.body.angle <= this.startang - 175 && this.body.angle >= this.startang - 180) || (this.body.angle >= this.startang && this.body.angle <= this.startang + 5 ) || (this.body.angle <= this.startang && this.body.angle >= this.startang - 5)) {
        this.turn = false
      }
    }
    
  }

  chase () {
    this.animations.play('snek')
    this.moveToObject(this.body, this.player)
  }

  update () {
    super.update()

    this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
    if (this.player_dist > this.renderdist && !this.isOffCamera)
    {
      this.isOffCamera = true
      this.kill()
    }
    else if (this.player_dist <= this.renderdist && this.isOffCamera)
    {
      this.isOffCamera = false
      this.revive()
    }
    this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    if (this.player_dist > this.chase_dist)
    {
      this.patrol()
    }
    else if (this.player_dist <= this.chase_dist)
    {
      this.chase()
    }

  }

  setupAnimations () {
    this.animations.add('snek', [0], 1, false)
  }

  moveToObject (obj1, obj2) {
    var angle = Math.atan2(obj2.y - obj1.y, obj2.x - obj1.x)
    obj1.rotation = angle + Phaser.Math.degToRad(90)  // correct angle of angry bullets (depends on the sprite used)
    obj1.force.x = Math.cos(angle) * this.chasespd    // accelerateToObject 
    obj1.force.y = Math.sin(angle) * this.chasespd
  }
}
export default Enemy
