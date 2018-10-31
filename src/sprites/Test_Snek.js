import Phaser from 'phaser'
import config from '../config'
import PlayerBoat from '../sprites/PlayerBoat'
import Enemy from './Enemy'
import { sequentialNumArray } from '../utils'
import Fireball from '../sprites/Fireball'

class Test_Snek extends Enemy {
  constructor (game) {
    super(game)
    this.touch_damage = 10
    this.setupAnimations()
    this.fire_dist = 50

    this.timer = new Phaser.Timer(this.game, false)

    // this.fireb = new Fireball(game, this.x, this.y, this.angle)
  }

  attack () {
    this.loadTexture('seasnake_attack')
    this.animations.play('attack')
  }

  fire () {
    this.fireb = new Fireball(this.parent.game, this.x, this.y, this.angle)
    this.game.add.existing(this.fireb)
    this.fireb.body.moveForward(this.fireb.speed)
  }

  update () {
    super.update()

    this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
    if (this.player_dist > this.renderdist && !this.isOffCamera) {
      this.isOffCamera = true
      this.kill()
      console.log('killed')
    } else if (this.player_dist <= this.renderdist && this.isOffCamera) {
      this.isOffCamera = false
      this.revive()
      console.log('revived')
    }
    this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    if (this.player_dist > this.chase_dist) {
      this.patrol()
    } else if (this.player_dist <= this.chase_dist && this.player_dist > this.fire_dist) {
      this.chase()
    }
    else if (this.player_dist <= this.fire_dist) {
      this.attack()
      this.timer.loop(1000, this.fire(), this, true)
    }
  }

  setupAnimations () {
    this.animations.add('swim', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)
    this.animations.add('attack', sequentialNumArray(0, 8), false)
  }
}
export default Test_Snek
