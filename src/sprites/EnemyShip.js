import Enemy from './Enemy'
import Phaser from 'phaser'
import GameData from '../GameData'
import Test_Cannonball from './Test_Cannonball'
import { sequentialNumArray } from '../utils';

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

    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    this.shotType = GameData.shotTypes.MULTISHOTx

    this.damage = 20
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

  update () {
    // super.update()
    this.player_dist = Phaser.Math.distance(this.body.x, this.body.y, this.player.x, this.player.y)
    this.start_diff = Phaser.Math.distance(this.body.x, this.body.y, this.startx, this.starty)
    this.patrol()
    if(this.curBoatSpeed > 20)
    {
      console.log('should play forward')
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
