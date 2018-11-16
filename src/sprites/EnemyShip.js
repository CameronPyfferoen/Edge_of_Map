import Enemy from './Enemy'
import Phaser from 'phaser'
import GameData from '../GameData'
import Test_Cannonball from './Test_Cannonball'
import { sequentialNumArray } from '../utils';

class EnemyShip extends Enemy
{
  constructor ( game) {
    super ( game )
    this.loadtexture('enemyship')
    this.setupAnimations()

    this.intBoatSpeed = 40
    this.curBoatSpeed = 0
    this.turnSpeed = 15
    this.backSpeed = 10
    this.turnAngle = 0.6

    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
    this.shotType = GameData.shotTypes.MULTISHOT

    this.damage = 20
  }

  moveForward () {
    if (this.curBoatSpeed < this.intBoatSpeed) {
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
      this.body.moveBackward(this.bckspd)
    }
  }

  setupAnimations () {
    this.animations.add('idle', sequentialNumArray(0, 5), 10, true)
    this.animations.add('forward', sequentialNumArray(5, 8), 10, true)
    this.animations.add('death', sequentialNumArray(34, 59), 10, false)
  }
}

export default EnemyShip
