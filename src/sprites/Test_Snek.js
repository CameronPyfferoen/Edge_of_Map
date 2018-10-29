import Phaser from 'phaser'
import config from '../config'
import PlayerBoat from '../sprites/PlayerBoat'
import Enemy from './Enemy'
import { sequentialNumArray } from '../utils'
import Fireball from '../sprites/Fireball'

class Test_Snek extends Enemy
{ 
  constructor ( game ) {
    super(game)
    this.touch_damage = 10
    this.setupAnimations()

    this.fireb = Fireball(this.game, this.x, this.y, this.angle)
  }

  attack () {
    this.loadTexture('seasnake_attack')
    this.animations.play('attack')
  }

  fire () {
    this.fireb.x = this.x
    this.fireb.y = this.y
    this.fireb.angle = this.angle
    this.game.add.existing(this.fireb)
  }

  setupAnimations () {
    this.animations.add('swim', [0, 1, 2, 3, 4, 5, 6, 7], 10, true)
    this.animations.add('attack', sequentialNumArray(0, 8), false)
  }
}
export default Test_Snek
