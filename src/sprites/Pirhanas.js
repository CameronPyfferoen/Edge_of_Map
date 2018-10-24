import Enemy from './Enemy'
import Phaser from 'phaser'

class Pirhanas extends Enemy
{
  constructor ( game ) {
    super ( game )
    Phaser.Sprite.loadtexture('pirhanas')
    this.setupAnimations()
  }

  setupAnimations()
  {
    this.setupAnimations.add('swim', [0], 1, false)
  }
}

export default Pirhanas
