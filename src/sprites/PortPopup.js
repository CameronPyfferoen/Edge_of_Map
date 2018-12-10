import Phaser from 'phaser'
import config from '../config'
import { sequentialNumArray } from '../utils';

class PortPopup extends Phaser.Sprite {
  constructor ({ game, x, y, player }) { 
    super(game, x, y, 'enterToPort', 0)
    this.name = 'portPopup';
    this.game = game;
    this.x = x;
    this.y = y;
    this.player = player;

    this._SCALE = config.PLAYER_SCALE * 0.5
    this.scale.setTo(this._SCALE)

    this.anchor.setTo(0.5, 1);
    this.smoothed = false;
    this.close = false;
    this.setupAnimations();
    this.idleAnim.play();
    this.alpha = 0;
  }

  update () {
    super.update();
    
    if (Phaser.Math.distance(this.x, this.y, this.player.x, this.player.y) <= 200 && !this.close) {
      this.alpha = 1;
      this.close = true;
    } 
    else if (Phaser.Math.distance(this.x, this.y, this.player.x, this.player.y) > 200 && this.close) {
      this.alpha = 0;
      this.close = false;
    }
  }

  setupAnimations () {
    this.idleAnim = this.animations.add('idle', sequentialNumArray(0, 11), 5, true);
  }
}
export default PortPopup
