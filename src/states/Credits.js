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
    this.game.deathTune.play('', 1, config.MUSIC_VOLUME);
    this.game.add.tileSprite(0, 0, 1900, 950, 'mainMenuBackground');
    this.board = this.game.add.sprite(
      this.world.centerX, 
      this.world.centerY, 
      'creditsMenu');
    this.board.anchor.setTo(0.5, 0.5);
    this.backButton = this.game.add.button(this.world.centerX + 240, this.world.centerY + 180, 'backButton', this.sendToMain, this, 1, 0, 1, 0);
    this.backButton.anchor.setTo(0.5, 0);
  }

  update () {

  }

  sendToMain () {
    this.game.deathTune.destroy();
    this.state.start('MainMenu');
  }
}
export default Credits
