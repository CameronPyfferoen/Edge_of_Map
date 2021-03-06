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
    this.game.sounds.play('deathTune', config.MUSIC_VOLUME);
    // this.game.mainMenuTheme = this.game.add.audio('mainMenuTheme', config.MUSIC_VOLUME)
    // this.game.mainMenuTheme.loop = true;
    this.game.add.tileSprite(0, 0, 1900, 950, 'deathScreen');
    this.game.add.button(this.world.centerX - 179, this.world.centerY + 180, 'backButton', this.sendToMain, this, 1, 0, 1, 0);
    this.game.fullscreen = this.game.add.button(0, 0, 'fullScreen', this.makeFullScreen, this, 1, 0, 1, 0)

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
    if (!this.game.scale.isFullScreen) {
      this.game.fullscreen.setFrames(1, 0, 1, 0);
    } else {
      this.game.fullscreen.setFrames(3, 2, 3, 2);
    }
  }

  sendToMain () {
    this.game.sounds.stop('deathTune')
    this.game.sounds.play('click', config.SFX_VOLUME);
    this.state.start('MainMenu');
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
export default Dead
