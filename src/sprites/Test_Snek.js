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
    this.loadTexture('seasnake_final')
    this.setupAnimations()
    this.animations.play('swim')
    this.attacking = false
    this.canSwitch = true
    this.fire_dist = 80
    this.shot = false
    this.maxHealth = 80
    this.health = this.maxHealth
  }

  idle () {
    this.attacking = false
    // this.canSwitch = true
    this.body.velocity.x = 0
    this.body.velocity.y = 0
    if (this.animations.currentAnim.name === 'swim') {
      this.animations.stop()
    }
  }

  attack () {
    this.attacking = true
    // this.canSwitch = false
    this.body.velocity.x = 0
    this.body.velocity.y = 0
    if (this.player.health > 0) {
      this.animations.currentAnim.onComplete.add(this.fire, this)
    }
  }

  chase () {
    // this.canSwitch = true
    this.attacking = false
    // this.animations.play('swim')
    this.moveToObject(this.body, this.player)
  }

  fire () {
    this.fireb = new Fireball({
      game: this.game,
      x: this.x,
      y: this.y,
      angle: this.angle
    })
    this.game.add.existing(this.fireb)
    this.fireb.fire = true
    this.shot = true
  }

  update () {
    this.canSwitch = !this.attacking
    if (!this.attacking) {
      this.animations.play('swim')
    } else if (this.attacking) {
      this.animations.play('attack')
    }
    this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
    if (this.player_dist > this.renderdist && !this.isOffCamera) {
      this.isOffCamera = true
      this.kill()
    } else if (this.player_dist <= this.renderdist && this.isOffCamera) {
      this.isOffCamera = false
      this.revive()
    }
    this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    if (this.canSwitch) {
      if (this.player_dist > this.chase_dist) {
        this.patrol()
      } else if (this.player_dist <= this.chase_dist && this.player_dist > this.fire_dist) {
        this.chase()
      }
    } if (this.player_dist <= this.fire_dist) {
      console.log(`canSwitch: ${this.canSwitch}`)
      if (!this.shot) {
        this.attack()
      } else if (this.shot) {
        this.idle()
        if (!this.fireb.fire) {
          this.shot = false
        }
      }
    }
  }

  setupAnimations () {
    this.animations.add('swim', sequentialNumArray(0, 8), 10, true)
    this.animations.add('attack', sequentialNumArray(9, 17), 10, false)
  }
}
export default Test_Snek
