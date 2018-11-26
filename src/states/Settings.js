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
    this.board = this.game.add.sprite(
      this.world.centerX, 
      this.world.centerY, 
      'settingsMenuBoard')
    this.board.anchor.setTo(0.5, 0.5);
    this.game.add.button(
      this.world.centerX - 179, 
      this.world.centerY + 180, 
      'backButton', this.sendToMain, 
      this, 1, 0, 1, 0)
    this.SFXbarBG = this.game.add.sprite(
      this.world.centerX, 
      this.world.centerY, 
      'settingBarBG')
    this.SFXbarBG.anchor.setTo(0.5, 0.5);

    this.SFXbarFG = this.game.add.sprite(
      this.world.centerX - 309, 
      this.world.centerY, 
      'settingBarFG')
    this.SFXbarFG.anchor.setTo(0, 0.5);

    this.SFXknob = this.game.add.sprite(
      this.world.centerX - 309 + (618 * (config.SFX_VOLUME / 1)),
      this.world.centerY, 
      'settingBarKnob')
    this.SFXknob.anchor.setTo(0.5, 0.5);
    
    this.SFXbounds = new Phaser.Rectangle(
      this.world.centerX - 321,
      this.world.centerY - 31,
      641, 66);
    this.SFXknob.inputEnabled = true;
    this.SFXknob.input.enableDrag();
    this.SFXknob.input.boundRect = this.SFXbounds;

    this.SFXVolumeDisplay = this.game.add.sprite( 
      this.world.centerX - 460, 
      this.world.centerY, 
      'SFXVolume')
    this.SFXVolumeDisplay.anchor.setTo(0.5, 0.5)
  }

  update () {
    this.SFXknob.y = this.world.centerY;
    if (this.SFXknob.x < 641) {
      this.SFXknob.x = 641;
    } else if (this.SFXknob.x > 1259) {
      this.SFXknob.x = 1259;
    }
    this.SFXbarFG.width = 618 * (config.SFX_VOLUME / 1);
    config.SFX_VOLUME = (this.SFXknob.x - 641) / (618);
    if (config.SFX_VOLUME <= 0) {
      this.SFXVolumeDisplay.frame = 0;
    } else if (config.SFX_VOLUME < 0.33) {
      this.SFXVolumeDisplay.frame = 1;
    } else if (config.SFX_VOLUME < 0.66) {
      this.SFXVolumeDisplay.frame = 2;
    } else {
      this.SFXVolumeDisplay.frame = 3;
    }
  }

  sendToMain () {
    this.state.start('MainMenu');
  }

}
export default Settings
