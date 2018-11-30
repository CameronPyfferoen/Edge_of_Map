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
    this.game.add.button(this.world.centerX - 179, this.world.centerY - 260, 'playButton', this.sendToCam, this, 1, 0, 1, 0)
    this.game.add.button(this.world.centerX - 333, this.world.centerY - 120, 'controlsButton', this.sendToControls, this, 1, 0, 1, 0)
    this.game.add.button(this.world.centerX - 308, this.world.centerY + 20, 'settingsButton', this.sendToSettings, this, 1, 0, 1, 0)
    this.exitButton = this.game.add.button(this.world.centerX + 300, this.world.centerY + 160, 'exitButton', this.sendToTest, this, 1, 0, 1, 0)
    this.exitButton.anchor.setTo(0.5, 0)
    this.creditsButton = this.game.add.button(this.world.centerX - 210, this.world.centerY + 160, 'creditsButton', this.sendToCredits, this, 1, 0, 1, 0)
    this.creditsButton.anchor.setTo(0.5, 0)
    this.game.explosion = this.game.add.audio('explosion', config.SFX_VOLUME)
    this.game.getHit = this.game.add.audio('getHit', config.SFX_VOLUME)
    this.game.deathTune = this.game.add.audio('deathTune', config.MUSIC_VOLUME)
    this.game.mainTheme = this.game.add.audio('mainTheme', config.MUSIC_VOLUME)
    
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
    this.state.start('Dead')
  }
  sendToCredits () {
    this.state.start('Credits')
  }

}
export default MainMenu
