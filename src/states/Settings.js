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
    this.game.fullscreen = this.game.add.button(0, 0, 'fullScreen', this.makeFullScreen, this, 1, 0, 1, 0)

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
    // ------------------------------------------------
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
      this.world.centerX - 420, 
      this.world.centerY, 
      'SFXVolume')
    this.SFXVolumeDisplay.anchor.setTo(0.5, 0.5)
    // -----------------------------------------------
    this.MusicbarBG = this.game.add.sprite(
      this.world.centerX, 
      this.world.centerY - 100, 
      'settingBarBG')
    this.MusicbarBG.anchor.setTo(0.5, 0.5);

    this.MusicbarFG = this.game.add.sprite(
      this.world.centerX - 309, 
      this.world.centerY - 100, 
      'settingBarFG')
    this.MusicbarFG.anchor.setTo(0, 0.5);

    this.Musicknob = this.game.add.sprite(
      this.world.centerX - 309 + (618 * (config.MUSIC_VOLUME / 1)),
      this.world.centerY - 100, 
      'settingBarKnob')
    this.Musicknob.anchor.setTo(0.5, 0.5);
    
    this.Musicknob.inputEnabled = true;
    this.Musicknob.input.enableDrag();

    this.MusicVolumeDisplay = this.game.add.sprite( 
      this.world.centerX - 480, 
      this.world.centerY - 160, 
      'MusicNote')
    this.SFXVolumeDisplay.anchor.setTo(0.5, 0.5)

    window.onkeydown = function (event) {
      if (event.keyCode === 79) {
        if (this.game.scale.isFullScreen) {
          this.game.scale.stopFullScreen();
          this.game.fullscreen.setFrames(1, 0, 1, 0);
        }
        else {
          this.game.scale.startFullScreen(false);
          this.game.fullscreen.setFrames(3, 2, 3, 2);
        }
      }
    }
  }

  update () {
    this.SFXknob.y = this.world.centerY;
    this.Musicknob.y = this.world.centerY- 100;
    if (this.SFXknob.x < 641) {
      this.SFXknob.x = 641;
    } else if (this.SFXknob.x > 1259) {
      this.SFXknob.x = 1259;
    }
    if (this.Musicknob.x < 641) {
      this.Musicknob.x = 641;
    } else if (this.Musicknob.x > 1259) {
      this.Musicknob.x = 1259;
    }
    this.SFXbarFG.width = 618 * (config.SFX_VOLUME / 1);
    config.SFX_VOLUME = (this.SFXknob.x - 641) / (618);
    this.MusicbarFG.width = 618 * (config.MUSIC_VOLUME / 1);
    config.MUSIC_VOLUME = (this.Musicknob.x - 641) / (618);

    if (config.SFX_VOLUME <= 0) {
      this.SFXVolumeDisplay.frame = 0;
    } else if (config.SFX_VOLUME < 0.33) {
      this.SFXVolumeDisplay.frame = 1;
    } else if (config.SFX_VOLUME < 0.66) {
      this.SFXVolumeDisplay.frame = 2;
    } else {
      this.SFXVolumeDisplay.frame = 3;
    }

    if (config.MUSIC_VOLUME <= 0) {
      this.MusicVolumeDisplay.frame = 1;
    } else {
      this.MusicVolumeDisplay.frame = 0;
    }

    if (!this.game.scale.isFullScreen) {
      this.game.fullscreen.setFrames(1, 0, 1, 0);
    } else {
      this.game.fullscreen.setFrames(3, 2, 3, 2);
    }
    this.game.clickSound.volume = config.SFX_VOLUME;
    this.game.mainMenuTheme.volume = config.MUSIC_VOLUME;
  }

  sendToMain () {
    this.game.clickSound.play('', 0, config.SFX_VOLUME);
    this.state.start('MainMenu');
  }

  makeFullScreen () {
    this.game.clickSound.play('', 0, config.SFX_VOLUME);
    if (this.game.scale.isFullScreen) {
      this.game.scale.stopFullScreen();
      this.game.fullscreen.setFrames(1, 0, 1, 0)
    }
    else {
      this.game.scale.startFullScreen(false);
      this.game.fullscreen.setFrames(3, 2, 3, 2)
    }
  }

}
export default Settings
