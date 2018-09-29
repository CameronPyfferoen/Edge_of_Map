import Phaser from 'phaser';
import config from '../config';
import Test_Snek from '../sprites/Test_Snek';
import { Sprite } from 'phaser-ce';

class Cam_TestLevel extends Phaser.State {
  init () {
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)
  }

  preload () {}

  create () {
    this.player = new Test_Snek({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32
    })

    this.game.add.existing(this.player);
  }
}

export default Cam_TestLevel
