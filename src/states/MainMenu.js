// Import phaser
import Phaser from 'phaser'

// Import config settings
import config from '../config'

class MainMenu extends Phaser.State {

  init () {
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

}
