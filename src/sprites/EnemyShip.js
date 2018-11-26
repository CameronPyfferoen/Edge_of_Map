import Enemy from './Enemy'
import Phaser from 'phaser'
import GameData from '../GameData'
import Test_Cannonball from './Test_Cannonball'
import { sequentialNumArray } from '../utils';
import { Line } from 'phaser-ce';

class EnemyShip extends Enemy
{
  constructor ( game) {
    super ( game )
    this.loadTexture('enemyship', 0)
    this.setupAnimations()

    this.intBoatSpeed = 40
    this.curBoatSpeed = 0
    this.turnSpeed = 15
    this.backSpeed = 10
    this.turnAngle = 0.6
    this.FWD = false
    this.playerLine = new Line(this.body.x, this.body.y, this.player.x, this.player.y)
    this.perpLine = new Line(this.body.x, this.body.y, this.player.x, this.player.y)
    // this.perpSlope = 0
    this.perpAngle = 0
    this.playerAngle = 0
    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    this.shotType = GameData.shotTypes.MULTISHOTx

    this.damage = 20
    this.chase_dist = 300
    this.post_dist = 150
  }

  positioning () {
    if(this.body.rotation < this.perpAngle)
    {
      this.body.rotation += Phaser.Math.degToRad(this.turnAngle)
    }
    else if(this.body.rotation > this.perpAngle)
    {
      this.body.rotation -= Phaser.Math.degToRad(this.turnAngle)
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

  patrol () {
    if (!this.turn) {
      this.moveForward(this.intBoatSpeed)
      if (this.pat_dist <= this.start_diff) {
        this.turn = true
      }
    }
    else if (this.turn) {
      this.turnRight()
      if(this.curBoatSpeed > this.turnSpeed)
      {
        this.slowDown()
      }
      this.moveForward(this.turnSpeed)
      if ((this.body.angle >= this.startang + 175 && this.body.angle <= this.startang + 180 ) || (this.body.angle <= this.startang - 175 && this.body.angle >= this.startang - 180) || (this.body.angle >= this.startang && this.body.angle <= this.startang + 5 ) || (this.body.angle <= this.startang && this.body.angle >= this.startang - 5)) {
        this.turn = false
      }
    }
  }

  chase () {
    if (this.body.rotation < this.playerAngle)
    {
      this.body.rotation += Phaser.Math.degToRad(this.turnAngle)
    }
    else if(this.body.rotation > this.playerAngle)
    {
      this.body.rotation -= Phaser.Math.degToRad(this.turnAngle)
    }
    else
    {
      this.moveForward(this.intBoatSpeed)
    }
  }

  update () {
    this.playerLine.setTo(this.body.x, this.body.y, this.player.x, this.player.y)
    // this.perpSlope = this.playerLine.perpSlope
    this.playerAngle = this.playerLine.angle + Phaser.Math.HALF_PI
    this.perpAngle = this.playerLine.normalAngle
    this.perpLine.fromAngle(this.body.x, this.body.y, this.perpAngle, this.player_dist)
    this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
    this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    if(this.player_dist > this.chase_dist)
    {
      this.patrol()
    }
    else if(this.player_dist <= this.chase_dist && this.player_dist > this.post_dist)
    {
      this.chase()
    }
    else if(this.player_dist <= this.post_dist)
    {
      this.positioning()
    }
    if(this.curBoatSpeed > 20)
    {
      // console.log('should play forward')
      this.FWD = true
    }
    else
    {
      this.FWD = false
    }
    if(this.FWD)
    {
      this.animations.play('forward')
    }
    else
    {
      this.animations.play('idle')
    }
  }

  setupAnimations () {
    this.animations.add('idle', sequentialNumArray(0, 4), 10, true)
    this.animations.add('forward', sequentialNumArray(26, 29), 10, true)
    this.animations.add('death', sequentialNumArray(155, 180), 10, false)
  }
}

export default EnemyShip
