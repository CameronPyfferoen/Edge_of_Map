import Phaser from 'phaser';
import config from '../config';
import Test_Snek from '../sprites/Test_Snek';
import { Sprite } from 'phaser-ce';

class Cam_TestLevel extends Phaser.State {
  init () {
    this.game.add.tileSprite(0 , 0, 3149, 2007, 'map')
    this.game.world.setBounds(0, 0, 3149, 2007)
  }

  preload () {}

  create () {
    this.snek = new Test_Snek({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32
    })

    this.game.add.existing(this.snek);

    // this.game.camera.scale.x = 4.2
    // this.game.camera.scale.y = 4.2
    this.game.camera.follow(this.snek)
  }
}

export default Cam_TestLevel
