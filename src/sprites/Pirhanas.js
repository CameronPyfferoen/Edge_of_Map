import Enemy from './Enemy'
import Phaser from 'phaser'

class Pirhanas extends Enemy
{
  constructor ( game ) {
    super ( game )
    this.changeTexture()
    this.setupAnimations()
    this.animations.play('pir_swim')
  }

  changeTexture()
  {
    this.loadTexture('pirhanas', 0, false)
    this.body.setRectangleFromSprite(this)
  }

  setupAnimations()
  {
    this.animations.add('pir_swim', [0], 1, false)
  }
}

export default Pirhanas
