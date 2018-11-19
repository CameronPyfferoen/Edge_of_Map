// Import phaser
import Phaser from 'phaser'

// Import config settings
import config from '../config'

class MainMenu extends Phaser.State {
  init () {
    this.game.world.setBounds(0, 0, 1900, 950)
    this.game.world.scale.setTo(1) // 2
  }

  preLoad () {}

  create () {
    this.game.add.tileSprite(0, 0, 1900, 950, 'mainMenuBackground')

    this.game.add.button(this.world.centerX - 179, this.world.centerY - 240, 'playButton', this.sendToCam, this, 1, 0, 1, 0)
    this.game.add.button(this.world.centerX - 333, this.world.centerY - 100, 'controlsButton', this.sendToControls, this, 1, 0, 1, 0)
    this.game.add.button(this.world.centerX - 308, this.world.centerY + 40, 'settingsButton', this.sendToSettings, this, 1, 0, 1, 0)
    this.game.add.button(this.world.centerX - 179, this.world.centerY + 180, 'exitButton', this.sendToTest, this, 1, 0, 1, 0)
  }

  update () {

  }

  sendToCam () {
    this.state.start('Cam_TestLevel')
  }
  sendToControls () {
    this.state.start('Controls')
  }
  sendToSettings () {
    this.state.start('Settings')
  }
  sendToTest () {
    this.state.start('TestLevel')
  }

}
export default MainMenu
