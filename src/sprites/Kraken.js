import Enemy from './Enemy'
import Phaser from 'phaser'

class Kraken extends Enemy
{
  constructor ( game ) {
    super ( game )
    this.changeTexture()
    this.setupAnimations()
    this.animations.play('kraken_swim')
  }

  changeTexture()
  {
    this.loadTexture('kraken', 0, false)
    this.body.setRectangleFromSprite(this)
  }

  setupAnimations()
  {
    this.animations.add('kraken_swim', [0], 1, false)
  }
}

export default Kraken
