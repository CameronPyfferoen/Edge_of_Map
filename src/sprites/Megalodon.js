import Enemy from './Enemy'
import Phaser from 'phaser'

class Megalodon extends Enemy
{
  constructor ( game ) {
    super ( game )
    this.changeTexture()
    this.setupAnimations()
    this.animations.play('mega_swim')
  }

  changeTexture()
  {
    this.loadTexture('megalodon', 0, false)
    this.body.setRectangleFromSprite(this)
  }

  setupAnimations()
  {
    this.animations.add('mega_swim', [0], 1, false)
  }
}

export default Megalodon
