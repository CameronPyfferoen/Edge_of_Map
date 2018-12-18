import Enemy from './Enemy'
import Phaser from 'phaser'
import GameData from '../GameData'
import Test_Cannonball from './Test_Cannonball'
import Enemy_Cannonball from './Enemy_Cannonball'
import { sequentialNumArray } from '../utils'
import { Line } from 'phaser-ce'
import config from '../config'
import GoldDrop from '../sprites/GoldDrop'

class EnemyShip extends Enemy {
  constructor (game) {
    super(game)
    this.loadTexture('enemyship', 0)
    this.setupAnimations()

    this.intBoatSpeed = 50
    this.curBoatSpeed = 0
    this.fireBoatSpeed = 20
    this.turnSpeed = 18
    this.backSpeed = 20
    this.turnAngle = 0.8
    this.FWD = false
    this.playerLine = new Line(this.body.x, this.body.y, this.player.x, this.player.y)
    this.perpLine = new Line(this.body.x, this.body.y, this.player.x, this.player.y)
    // this.perpSlope = 0
    this.perpAngle = 0
    this.playerAngle = 0
    this.conAngDiffDeg = 0
    this.conLine = new Line(this.body.x, this.body.y, this.body.x + 2, this.body.y + 2)
    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    this.shotType = GameData.shotTypes.MULTISHOTx

    this.maxHealth = 50
    this.health = this.maxHealth
    this.damage = 10
    this.ram_damage = 5

    this.pat_dist = 200
    this.chase_dist = 400
    this.post_dist = 200
    this.perpAngDiff = 0
    this.perpAngDiffDeg = 0

    this.body.clearShapes()
    this.body.addCapsule(18, 6, 0, 0, -1.55)
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
    this.playedDeathSoundTimer = 0;
    this.timer = null
    this.canFire = true
    this.playerInvincible = false
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

  positioning () {
    if (this.curBoatSpeed > this.fireBoatSpeed) {
      this.slowDown()
    } else {
      this.moveForward(this.fireBoatSpeed)
    }
    if ((this.perpAngDiff > -0.010472 && this.perpAngDiff < 0.010472) || (this.perpAngDiff > 3.13112 && this.perpAngDiff < -3.13112)) {
      this.body.angularVelocity = 0
      if (this.perpAngDiffDeg > -0.6 && this.perpAngDiffDeg < 0.6) {
        if (!this.playerInvincible) {
          console.log('fire right')
          this.firingCallback2()
        }
      } else if (this.perpAngDiffDeg > 179.4 || this.perpAngDiffDeg < -179.4) {
        if (!this.playerInvincible) {
          console.log('fire left')
          this.firingCallback()
        }
      }
    } else if ((this.perpAngDiff > Phaser.Math.HALF_PI && this.perpAngDiff < 2 * Phaser.Math.HALF_PI) || (this.perpAngDiff > -1 * Phaser.Math.HALF_PI && this.perpAngDiff < 0)) {
      this.turnRight()
    } else if ((this.perpAngDiff > 0 && this.perpAngDiff < Phaser.Math.HALF_PI) || (this.perpAngDiff > -2 * Phaser.Math.HALF_PI && this.perpAngDiff < -1 * Phaser.Math.HALF_PI)) {
      this.turnLeft()
    }
  }

  moveForward (speed) {
    if (this.curBoatSpeed < speed) {
      this.curBoatSpeed += 2
    }
    this.body.moveForward(this.curBoatSpeed)
  }

  slowDown () {
    if (this.curBoatSpeed > 0) {
      this.curBoatSpeed -= 0.2
    }
    this.body.moveForward(this.curBoatSpeed)
  }

  turnLeft () {
    this.body.angle -= this.turnAngle
  }

  turnRight () {
    this.body.angle += this.turnAngle
  }

  moveBackward () {
    if (this.curBoatSpeed > 1) {
      this.curBoatSpeed--
    } else {
      this.body.moveBackward(this.backSpeed)
    }
  }

  thrustBackward () {
    this.body.reverse(1000)
    console.log('thrust')
  }

  thrustForward () {
    this.body.thrust(1000)
  }


  patrol () {
    if (!this.turn) {
      this.moveForward(this.intBoatSpeed)
      if (this.pat_dist <= this.start_diff) {
        this.turn = true
      }
    } else if (this.turn) {
      this.turnRight()
      if (this.curBoatSpeed > this.turnSpeed) {
        this.slowDown()
      }
      this.moveForward(this.turnSpeed)
      if ((this.body.angle >= this.startang + 175 && this.body.angle <= this.startang + 180) || (this.body.angle <= this.startang - 175 && this.body.angle >= this.startang - 180) || (this.body.angle >= this.startang && this.body.angle <= this.startang + 5) || (this.body.angle <= this.startang && this.body.angle >= this.startang - 5)) {
        this.turn = false
      }
    }
  }

  idle () {
    this.body.velocity.x = 0
    this.body.velocity.y = 0
  }

  chase () {
    if (this.body.rotation < this.playerAngle) {
      this.turnRight()
    } else if (this.body.rotation > this.playerAngle) {
      this.turnLeft()
    }
    this.moveForward(this.intBoatSpeed)
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

  firingCallback () {
    if (this.canFire) {
      this.spreadShotLeft()
      this.canFire = false
      this.firingCallbackCooldown()
    }
  }

  firingCallbackCooldown () {
    this.timer = this.game.time.create(false)

    this.timer.add(2000, function () {
      this.canFire = true
    }.bind(this))

    this.timer.start()
  }

  rotate (cx, cy, x, y, angle) {
    let radians = (Math.PI / 180) * angle

    let cos = Math.cos(radians)

    let sin = Math.sin(radians)

    let nx = (cos * (x - cx)) + (sin * (y - cy)) + cx

    let ny = (cos * (y - cy)) - (sin * (x - cx)) + cy
    console.log(nx)
    console.log(ny)
    return [nx, ny]
  }

  spreadShotLeft () {
    this.game.camera.shake(0.001, 250)
    this.game.sounds.play('explosion', config.SFX_VOLUME)
    let canPos1 = [this.x, this.y]
    let canPos2 = [this.x, this.y + 7.5]
    let canPos3 = [this.x, this.y - 7.5]

    canPos1 = this.rotate(this.x, this.y, canPos1[0], canPos1[1], this.angle * -1)
    canPos2 = this.rotate(this.x, this.y, canPos2[0], canPos2[1], this.angle * -1)
    canPos3 = this.rotate(this.x, this.y, canPos3[0], canPos3[1], this.angle * -1)

    let cannonball = new Enemy_Cannonball({
      game: this.game,
      x: canPos1[0],
      y: canPos1[1],
      damage: this.damage
    })
    let cannonball2 = new Enemy_Cannonball({
      game: this.game,
      x: canPos2[0],
      y: canPos2[1],
      damage: this.damage
    })
    let cannonball3 = new Enemy_Cannonball({
      game: this.game,
      x: canPos3[0],
      y: canPos3[1],
      damage: this.damage
    })
    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 15
    this.cannonballHeight = 15

    // Set cannonball angle, velocity, and size
    cannonball.body.angle = this.angle - 90
    cannonball.body.moveForward(400)
    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight

    cannonball2.body.angle = this.angle - 90
    cannonball2.body.moveForward(400)
    cannonball2.width = this.cannonballWidth
    cannonball2.height = this.cannonballHeight

    cannonball3.body.angle = this.angle - 90
    cannonball3.body.moveForward(400)
    cannonball3.width = this.cannonballWidth
    cannonball3.height = this.cannonballHeight
  }

  firingCallback2 () {
    if (this.canFire) {
      this.spreadShotRight()
      this.canFire = false
      this.firingCallbackCooldown2()
    }
  }

  firingCallbackCooldown2 () {
    this.timer = this.game.time.create(false)

    this.timer.add(2000, function () {
      this.canFire = true
    }.bind(this))

    this.timer.start()
  }

  spreadShotRight () {
    this.game.camera.shake(0.001, 250)
    this.game.sounds.play('explosion', config.SFX_VOLUME)
    let canPos1 = [this.x, this.y]
    let canPos2 = [this.x, this.y + 7.5]
    let canPos3 = [this.x, this.y - 7.5]

    canPos1 = this.rotate(this.x, this.y, canPos1[0], canPos1[1], this.angle * -1)
    canPos2 = this.rotate(this.x, this.y, canPos2[0], canPos2[1], this.angle * -1)
    canPos3 = this.rotate(this.x, this.y, canPos3[0], canPos3[1], this.angle * -1)

    let cannonball = new Enemy_Cannonball({
      game: this.game,
      x: canPos1[0],
      y: canPos1[1],
      damage: this.damage
    })
    let cannonball2 = new Enemy_Cannonball({
      game: this.game,
      x: canPos2[0],
      y: canPos2[1],
      damage: this.damage
    })
    let cannonball3 = new Enemy_Cannonball({
      game: this.game,
      x: canPos3[0],
      y: canPos3[1],
      damage: this.damage
    })
    // Add sprite to the projectile physics group
    this.projectile.add(cannonball)
    this.projectile.add(cannonball2)
    this.projectile.add(cannonball3)

    // Set projectile sprite size, spawn location, and velocity
    this.cannonballWidth = 15
    this.cannonballHeight = 15

    // Set cannonball angle, velocity, and size
    cannonball.body.angle = this.angle + 90
    cannonball.body.moveForward(400)
    cannonball.width = this.cannonballWidth
    cannonball.height = this.cannonballHeight

    cannonball2.body.angle = this.angle + 90
    cannonball2.body.moveForward(400)
    cannonball2.width = this.cannonballWidth
    cannonball2.height = this.cannonballHeight

    cannonball3.body.angle = this.angle + 90
    cannonball3.body.moveForward(400)
    cannonball3.width = this.cannonballWidth
    cannonball3.height = this.cannonballHeight
  }

  update () {
    this.playerInvincible = this.player.getvincible()
    if (this.health <= 0) {
      if (this.playedDeathSoundTimer === 0) {
        this.game.sounds.play('explosion', config.SFX_VOLUME);
      } else if (this.playedDeathSoundTimer === 30) {
        this.game.sounds.play('explosion', config.SFX_VOLUME);
      } else if (this.playedDeathSoundTimer === 60) {
        this.game.sounds.play('explosion', config.SFX_VOLUME);
        this.body.clearShapes()
      }
      this.playedDeathSoundTimer++;
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
        this.body.angle -= this.turnAngle
      } else if (this.count >= 200) {
        this.isLand = false
        this.isPlayer = false
        this.enemyInvincible = false
      }
      this.count++
    } else {
      this.playerLine.setTo(this.body.x, this.body.y, this.player.x, this.player.y)
      // this.perpSlope = this.playerLine.perpSlope
      this.playerAngle = this.playerLine.angle + Phaser.Math.HALF_PI
      this.perpAngle = this.playerLine.angle
      this.perpAngDiff = (this.body.rotation - this.perpAngle) % (2 * Phaser.Math.HALF_PI)
      this.perpAngDiffDeg = (this.body.angle - Phaser.Math.radToDeg(this.perpAngle) % (360))
      // console.log(`perpAngDiffDeg: ${this.perpAngDiffDeg}`)
      // console.log(`perpAngle: ${this.perpAngle}`)
      // console.log('perpAngle: ' + this.perpAngle)
      // console.log(`enemy ship rotation: ${this.body.rotation}`)
      // console.log(`perpAngDiff: ${this.perpAngDiff}`)
      this.perpLine.fromAngle(this.body.x, this.body.y, this.perpAngle, this.player_dist)
      this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
      this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
      if (this.player_dist > this.chase_dist) {
        this.patrol()
      } else if (this.player_dist <= this.chase_dist && this.player_dist > this.post_dist) {
        this.chase()
      } else if (this.player_dist <= this.post_dist) {
        // console.log(`perpAngDiff: ${this.perpAngDiff}`)
        this.positioning()
      }
      if (this.curBoatSpeed >= 15) {
      // console.log('should play forward')
        this.FWD = true
      } else {
        this.FWD = false
      }
      if (this.FWD) {
        this.animations.play('forward')
      } else {
        this.animations.play('idle')
      }
    }
  }

  setupAnimations () {
    this.animations.add('idle', sequentialNumArray(0, 4), 10, true)
    this.animations.add('forward', sequentialNumArray(26, 29), 10, true)
    this.animations.add('death', sequentialNumArray(155, 180), 10, false)
  }
}

export default EnemyShip
