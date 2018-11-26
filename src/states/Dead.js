// Import phaser
import Phaser from 'phaser'

// Import config settings
import config from '../config'

class Dead extends Phaser.State {
  init () {
    this.game.world.setBounds(0, 0, 1900, 950)
    this.game.world.scale.setTo(1) // 2
  }

  preLoad () {}

  create () {
    this.game.add.tileSprite(0, 0, 1900, 950, 'mainMenuBackground')

  }

  update () {

  }

  sendToMain () {
    this.state.start('MainMenu');
  }
}
export default Dead
