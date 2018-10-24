import Enemy from './Enemy'
import Phaser from 'phaser'

class Megalodon extends Enemy
{
  constructor ( game ) {
    super ( game )
    Phaser.Sprite.loadtexture('megalodon')
    this.setupAnimations()
  }

  setupAnimations()
  {
    this.setupAnimations.add('swim', [0], 1, false)
  }
}

export default Megalodon
