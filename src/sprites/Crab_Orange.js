import Enemy from './Enemy'
import Phaser from 'phaser'

class Crab_Orange extends Enemy
{
  constructor ( game ) {
    super ( game )
    Phaser.Sprite.loadtexture('orangecrab')
    this.setupAnimations()
  }

  setupAnimations()
  {
    this.setupAnimations.add('swim', [0], 1, false)
  }
}

export default Crab_Orange
