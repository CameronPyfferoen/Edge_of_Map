// Import phaser
import Phaser from 'phaser'

// Import config settings
import config from '../config'

class Settings extends Phaser.State {
  init () {
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  preLoad () {}

  create () {
    this.game.add.tileSprite(0, 0, 1900, 950, 'mainMenuBackground')
    this.board = this.game.add.sprite(this.world.centerX, this.world.centerY, 'settingsMenuBoard')
    this.board.anchor.setTo(0.5, 0.5);
    this.game.add.button(this.world.centerX - 179, this.world.centerY + 180, 'backButton', this.sendToMain, this, 1, 0, 1, 0)
  }

  update () {

  }

  sendToMain () {
    this.state.start('MainMenu');
  }

}
export default Settings
