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
    this.game.fullscreen = this.game.add.button(0, 0, 'fullScreen', this.makeFullScreen, this, 1, 0, 1, 0)

    this.exitButton = this.game.add.button(this.world.centerX + 300, this.world.centerY + 160, 'exitButton', this.sendToExit, this, 1, 0, 1, 0)
    this.exitButton.anchor.setTo(0.5, 0)
    this.creditsButton = this.game.add.button(this.world.centerX - 210, this.world.centerY + 160, 'creditsButton', this.sendToCredits, this, 1, 0, 1, 0)
    this.creditsButton.anchor.setTo(0.5, 0)

    // this.game.deathTune = this.game.add.audio('deathTune', config.MUSIC_VOLUME)
    // this.game.mainThemeIntro = this.game.add.audio('mainThemeIntro', config.MUSIC_VOLUME)
    // this.game.mainTheme = this.game.add.audio('mainThemeLoop', config.MUSIC_VOLUME)
    // this.game.deathTune.loop = true;
    // this.game.mainTheme.loop = true;
    
    // Add fullscreen controls
    // Stretch to fill
    // this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;

    // Keep original size
    // this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.NO_SCALE;
 
    // Maintain aspect ratio
    if (!__NWJS__) {
      this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
    }
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

    // Play menu music
    if (!this.game.sounds.get('mainMenuTheme').isPlaying) {
      this.game.sounds.play('mainMenuTheme', config.MUSIC_VOLUME)
    }
  }

  update () {
    // this.game.mainMenuTheme.volume = config.MUSIC_VOLUME;
    // this.game.clickSound.volume = config.SFX_VOLUME;
    if (!this.game.scale.isFullScreen) {
      this.game.fullscreen.setFrames(1, 0, 1, 0);
    } else {
      this.game.fullscreen.setFrames(3, 2, 3, 2);
    }
  }

  sendToCam () {
    this.game.sounds.play('click', config.SFX_VOLUME);
    this.state.start('ControlsBeforePlay')
  }
  sendToControls () {
    this.game.sounds.play('click', config.SFX_VOLUME);
    this.state.start('Controls')
  }
  sendToSettings () {
    this.game.sounds.play('click', config.SFX_VOLUME);
    this.state.start('Settings')
  }
  sendToDead () {
    this.game.sounds.play('click', config.SFX_VOLUME);
    this.game.sounds.stop('mainMenuTheme');
    // this.state.start('Dead')
    this.game.destroy();
  }
  sendToExit () {
    this.game.sounds.play('click', config.SFX_VOLUME);
    if (__NWJS__) {
      window.close()
    }  
  }
  sendToCredits () {
    this.game.sounds.play('click', config.SFX_VOLUME);
    this.state.start('Credits')
  }
  makeFullScreen () {
    this.game.sounds.play('click', config.SFX_VOLUME);
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
export default MainMenu
