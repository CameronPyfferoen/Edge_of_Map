import Enemy from './Enemy'
import Phaser from 'phaser'

class Jellyfish extends Enemy
{
  constructor ( game ) {
    super ( game )
    this.changeTexture()
    this.setupAnimations()
    this.animations.play('jelly_swim')
  }

  changeTexture()
  {
    this.loadTexture('jellyfish', 0, false)
    this.body.setRectangleFromSprite(this)
  }

  setupAnimations()
  {
    this.animations.add('jelly_swim', [0], 1, false)
  }
}

export default Jellyfish
