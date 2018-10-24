import Enemy from './Enemy'
import Phaser from 'phaser'

class Crab_Blue extends Enemy
{
  constructor ( game ) {
    super ( game )
    Phaser.Sprite.loadtexture('bluecrab')
    this.setupAnimations()
  }

  setupAnimations()
  {
    this.setupAnimations.add('swim', [0], 1, false)
  }
}

export default Crab_Blue
