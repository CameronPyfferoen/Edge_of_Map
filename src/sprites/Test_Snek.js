import Phaser from 'phaser'
import config from '../config'
import PlayerBoat from '../sprites/PlayerBoat'
import Enemy from './Enemy'
import { sequentialNumArray } from '../utils'
import Fireball from '../sprites/Fireball'
import { Line, AnimationManager } from 'phaser-ce'
import GoldDrop from '../sprites/GoldDrop'

// change htibox to capsule
class Test_Snek extends Enemy {
  constructor (game) {
    super(game)
    this.loadTexture('seasnake_all')
    this.setupAnimations()
    this.animations.play('swim')
    this.playerLine = new Line(this.body.x, this.body.y, this.player.x, this.player.y)
    this.attacking = false
    this.canSwitch = true
    this.fire_dist = 120
    this.shot = false
    this.maxHealth = 30
    this.health = this.maxHealth
    this.state = 0
    this.ram_damage = 5
    this.turnAngle = 0.6
    this.playedDeathSound = false

    this.playerInvincible = false
    this.conAngDiffDeg = 0
    this.conLine = new Line(this.body.x, this.body.y, this.body.x + 2, this.body.y + 2)

    this.body.clearShapes()
    this.body.addCapsule(30, 6, 0, 0, -1.55)
    this.body.setCollisionGroup(this.game.enemyGroup)
    this.body.collides([this.game.playerGroup, this.game.landGroup, this.game.cannonballCollisionGroup])

    // cut if not working
    this.bodyShape = this.body.data.shapes[0]
    this.bodyShape.sensor = true
    this.body.onBeginContact.add(this.contact, this)

    // cut if not working
    this.n = 0
    this.isLand = false
    this.isPlayer = false
    this.isBall = false
    this.bitArray = []
    this.count = 0
  }
  // look here
  // cut if not working
  contact (otherBody, otherP2Body, myShape, otherShape, contactEQ) {
    this.n = 0
    if (otherBody !== null) {
      this.conLine.setTo(this.body.x, this.body.y, otherBody.x, otherBody.y)
      this.conAngDiffDeg = (this.body.angle - Phaser.Math.radToDeg(this.conLine.angle)) % 360
      if (otherBody.sprite !== null && otherBody.sprite.name !== null && otherBody.sprite.name === 'Cannonball') {
        this.isBall = true
      }

      if (!this.isBall) {
        otherBody.collidesWith.forEach(element => {
          this.bitArray.push(otherBody.collidesWith[this.n].mask)
          this.n++
        })
        if (this.bitArray.includes(4)) {
          this.isPlayer = false
        } else {
          this.isPlayer = true
          this.count = 0
        }
        if (this.isPlayer) {
          if (otherBody.sprite !== null) {
            this.player.health -= this.ram_damage
          }
        }
        if (this.bitArray.includes(32)) {
          this.isLand = false
        } else {
          this.isLand = true
          this.count = 0
        }
      }
      this.bitArray.length = 0
      this.isBall = false
    }
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
    // console.log(`player animation: ${this.player.animations.currentAnim.name}`)
    if (this.player.health <= 0) {
      this.idle()
    } else if (this.player.animations.currentAnim.name !== 'death' && this.player.animations.currentAnim.name !== 'ded') {
      if (this.player.health > 0 && !this.shot) {
        this.animations.currentAnim.onComplete.add(this.fire, this)
        // this.animations.currentAnim.onComplete.add(this.switch, this)
      }
    }
  }

  thrustBackward () {
    this.body.reverse(1000)
    console.log('thrust')
  }

  thrustForward () {
    this.body.thrust(1000)
  }

  switch () {
    if (this.canSwitch) {
      this.canSwitch = false
    } else {
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
    this.game.fireBallShoot.play('', 0, config.SFX_VOLUME)
    this.canSwitch = true
    this.shot = true
  }

  die () {
    this.gold = new GoldDrop({
      game: this.game,
      x: this.x,
      y: this.y
    })
    this.game.add.existing(this.gold)
    this.game.goldGroup.add(this.gold)
    this.destroy()
  }

  turnLeft () {
    this.body.angle -= this.turnAngle
  }

  update () {
    this.playerInvincible = this.player.getvincible()
    // console.log(`snake detection: ${this.playerInvincible}`)
    if (this.health <= 0) {
      if (!this.playedDeathSound) {
        this.game.snakeDeath.play('', 0, config.SFX_VOLUME)
        this.playedDeathSound = true
        this.body.clearShapes()
      }
      this.animations.play('death')
      this.animations.currentAnim.onComplete.add(this.die, this)
    }
    // look here
    // cut if not working
    else if (this.isLand || this.isPlayer) {
      this.enemyInvincible = true
      if (this.count < 5) {
        this.body.setZeroVelocity()
        this.body.angularVelocity = 0
      } else if (this.count < 10 && this.count >= 5 && (this.conAngDiffDeg > -45 || this.conAngDiffDeg < -135)) {
        this.body.angularVelocity = 0
        this.thrustBackward()
      }
      else if (this.count < 10 && this.count >= 5 && this.conAngDiffDeg <= -45 && this.conAngDiffDeg >= -135) {
        this.body.angularVelocity = 0
        this.thrustForward()
        if (this.count === 9) {
          this.count = 200
        }
      } else if (this.count >= 10 && this.count < 200) {
        this.turnLeft()
      } else if (this.count >= 200) {
        this.isLand = false
        this.isPlayer = false
        this.enemyInvincible = false
      }
      this.count++
    } else {
      this.playerLine.setTo(this.body.x, this.body.y, this.player.x, this.player.y)
      this.canSwitch = !this.attacking
      this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
      if (this.animations.currentAnim.name === 'attack') {
        if (this.shot)// && this.player_dist > this.fire_dist)
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
        if (this.player_dist > 400) { // this.chase_dist
          this.patrol()
        } else if (this.player_dist <= 400 && this.player_dist > this.fire_dist) {
          this.chase()
        }
      } if (this.player_dist <= this.fire_dist) {
        if (!this.shot) {
          if (!this.playerInvincible) {
            this.attack()
          }
        } else if (this.shot) {
          this.idle()
          if (!this.fireb.fire) {
            this.shot = false
          }
        }
      }
    }
  }

  setupAnimations () {
    this.animations.add('swim', sequentialNumArray(0, 8), 10, true)
    this.animations.add('attack', sequentialNumArray(12, 20), 10, false)
    this.animations.add('death', sequentialNumArray(24, 35), 10, false)
  }
}
export default Test_Snek
