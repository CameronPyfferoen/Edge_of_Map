import Enemy from './Enemy'
import Phaser from 'phaser'

class Kraken extends Enemy
{
  constructor ( game ) {
    super ( game )
    Phaser.Sprite.loadtexture('kraken')
    this.setupAnimations()
  }

  setupAnimations()
  {
    this.setupAnimations.add('swim', [0], 1, false)
  }
}

export default Kraken
