import Enemy from './Enemy'
import Phaser from 'phaser'

class Jellyfish extends Enemy
{
  constructor ( game ) {
    super ( game )
    Phaser.Sprite.loadtexture('jellyfish')
    this.setupAnimations()
  }

  setupAnimations()
  {
    this.setupAnimations.add('swim', [0], 1, false)
  }
}

export default Jellyfish
