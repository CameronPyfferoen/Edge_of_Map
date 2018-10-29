import Enemy from './Enemy'
import Phaser from 'phaser'
import { sequentialNumArray } from '../utils';

class Shark extends Enemy
{
  constructor ( game ) {
    super ( game )
    this.changeTexture()
    this.setupAnimations()
    this.animations.play('shark_swim')
  }

  changeTexture()
  {
    this.loadTexture('sharkSheet', 0, true)
    this.body.setRectangleFromSprite(this)
  }

  setupAnimations()
  {
    this.animations.add('shark_swim', sequentialNumArray(0, 7), 10, true)
  }
}

export default Shark
