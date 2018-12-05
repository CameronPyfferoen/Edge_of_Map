// Import phaser
import Phaser from 'phaser'

// Import config settings
import config from '../config'

class Controls extends Phaser.State {
  init () {
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  preLoad () {}

  create () {
    this.game.add.tileSprite(0, 0, 1900, 950, 'mainMenuBackground')
    this.game.add.sprite(this.world.centerX - 1165/2, this.world.centerY - 394, 'controlBoard')
    this.game.add.button(this.world.centerX - 179, this.world.centerY + 180, 'backButton', this.sendToMain, this, 1, 0, 1, 0)
  }

  update () {

  }

  sendToMain () {
    this.state.start('MainMenu');
  }

}
export default Controls
