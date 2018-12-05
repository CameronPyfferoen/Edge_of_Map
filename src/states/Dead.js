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
    this.game.deathTune.play('', 1, config.MUSIC_VOLUME);
    this.game.add.tileSprite(0, 0, 1900, 950, 'deathScreen');
    this.game.add.button(this.world.centerX - 179, this.world.centerY + 180, 'backButton', this.sendToMain, this, 1, 0, 1, 0);
  }

  update () {

  }

  sendToMain () {
    this.game.deathTune.destroy();
    this.state.start('MainMenu');
  }
}
export default Dead
