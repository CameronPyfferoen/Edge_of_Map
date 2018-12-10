// Import phaser
import Phaser from 'phaser'

// Import config settings
import config from '../config'

class ControlsBeforePlay extends Phaser.State {
  init () {
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  preLoad () {}

  create () {
    this.game.add.tileSprite(0, 0, 1900, 950, 'mainMenuBackground')
    this.game.add.sprite(this.world.centerX - 1165/2, this.world.centerY - 394, 'controlBoard')
    this.game.add.button(this.world.centerX - 179, this.world.centerY + 180, 'playButton', this.sendToMain, this, 1, 0, 1, 0)
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
    this.game.clickSound.play('', 0, config.SFX_VOLUME);
    this.game.mainMenuTheme.destroy();
    this.state.start('Cam_TestLevel');
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
export default ControlsBeforePlay
