// Import phaser
import Phaser from 'phaser'

// Import config settings
import config from '../config'

class Credits extends Phaser.State {
  init () {
    this.game.world.setBounds(0, 0, 1900, 950)
    this.game.world.scale.setTo(1) // 2
  }

  preLoad () {}

  create () {
    // this.game.sounds.play('deathTune', config.MUSIC_VOLUME);
    this.game.add.tileSprite(0, 0, 1900, 950, 'mainMenuBackground');
    this.board = this.game.add.sprite(
      this.world.centerX, 
      this.world.centerY, 
      'creditsMenu');
    this.board.anchor.setTo(0.5, 0.5);
    this.backButton = this.game.add.button(this.world.centerX + 250, this.world.centerY + 210, 'backButton', this.sendToMain, this, 1, 0, 1, 0);
    this.game.fullscreen = this.game.add.button(0, 0, 'fullScreen', this.makeFullScreen, this, 1, 0, 1, 0)
    this.backButton.anchor.setTo(0.5, 0);

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
export default Credits
