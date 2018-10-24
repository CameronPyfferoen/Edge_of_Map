import Enemy from './Enemy'
import Phaser from 'phaser'

class Crab_Orange extends Enemy
{
  constructor ( game ) {
    super ( game )
    this.changeTexture()
    this.setupAnimations()
    this.animations.play('orange_swim')
  }

  changeTexture()
  {
    this.loadTexture('orangecrab', 0, false)
    this.body.setRectangleFromSprite(this)
  }

  setupAnimations()
  {
    this.animations.add('orange_swim', [0], 1, false)
  }
}

export default Crab_Orange
