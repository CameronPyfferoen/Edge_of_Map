import Enemy from './Enemy'
import Phaser from 'phaser'

class Crab_Blue extends Enemy
{
  constructor ( game ) {
    super ( game )
    this.changeTexture()
    this.setupAnimations()
    this.animations.play('blue_swim')
  }

  changeTexture()
  {
    this.loadTexture('bluecrab', 0, false)
    this.body.setRectangleFromSprite(this)
  }

  setupAnimations()
  {
    this.animations.add('blue_swim', [0], 1, false)
  }
}

export default Crab_Blue
