import Phaser from 'phaser'
import config from '../config'
import PlayerBoat from '../sprites/PlayerBoat'
import Enemy from './Enemy'
import { sequentialNumArray } from '../utils'
import Fireball from '../sprites/Fireball'
import { Line } from 'phaser-ce'

// change htibox to capsule
class Test_Snek extends Enemy {
  constructor (game) {
    super(game)
    this.touch_damage = 10
    this.loadTexture('seasnake_final')
    this.setupAnimations()
    this.animations.play('swim')
    this.playerLine = new Line(this.body.x, this.body.y, this.player.x, this.player.y)
    this.attacking = false
    this.canSwitch = true
    this.fire_dist = 80
    this.shot = false
    this.maxHealth = 80
    this.health = this.maxHealth
    this.state = 0

    this.body.clearShapes();
    this.body.addCapsule(30, 6, 0, 0, -1.55)
  }

  idle () {
    this.animations.play('swim')
    this.state = 1
    this.attacking = false
    // this.switch()
    this.body.velocity.x = 0
    this.body.velocity.y = 0
    // this.animations.stop()
  }

  attack () {
    this.body.rotation = this.playerLine.angle + Phaser.Math.degToRad(90)
    this.state = 2
    this.animations.play('attack')
    this.canSwitch = false
    this.attacking = true
    this.body.velocity.x = 0
    this.body.velocity.y = 0
    console.log(`player animation: ${this.player.animations.currentAnim.name}`)
    if(this.player.health <= 0)
    {
      this.idle()
    }
    else if(this.player.animations.currentAnim.name !== 'death' && this.player.animations.currentAnim.name !== 'ded')
    {
      if (this.player.health > 0 && !this.shot) {
        this.animations.currentAnim.onComplete.add(this.fire, this)
        // this.animations.currentAnim.onComplete.add(this.switch, this)
      }
  }
  }

  switch ()
  {
    if (this.canSwitch)
    {
      this.canSwitch = false
    }
    else
    {
      this.canSwitch = true
    }
  }

  chase () {
    this.state = 3
    // this.canSwitch = true
    this.attacking = false
    this.animations.play('swim')
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
    this.canSwitch = true
    this.shot = true
  }

  update () {
    this.playerLine.setTo(this.body.x, this.body.y, this.player.x, this.player.y)
    this.canSwitch = !this.attacking
    this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
    if (this.animations.currentAnim.name === 'attack')
    {
      if (this.shot )//&& this.player_dist > this.fire_dist)
      {
        this.canSwitch = true
      }
    }
    /*
    if (!this.attacking) {
      this.animations.play('swim')
    } else if (this.attacking) {
      this.animations.play('attack')
    }
    */
    // console.log(`state: ${this.state}`)
    // console.log(`canSwitch: ${this.canSwitch}`)
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
