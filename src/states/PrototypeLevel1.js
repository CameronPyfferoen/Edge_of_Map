// Import the entire 'phaser' namespace
import Phaser from 'phaser'

// Import config settings
import config from '../config'

// Import the player boat
import PlayerBoat from '../sprites/PlayerBoat'
import { Sprite } from 'phaser-ce';

class PrototypeLevel1 extends Phaser.State {
  init () {
    // Set / Reset world bounds
    this.game.add.tileSprite(0, 0, 3149, 2007, 'map');
    this.game.world.setBounds(0, 0, 3149, 2007);
    this.game.time.advancedTiming = true;
    this.game.time.desiredFPS = 60;

    // set the initial and current speeds of the boat
    this.game.intBoatSpeed = 60;
    this.game.curBoatSpeed = 0;
  }

  preload () {}

  create () {
    // create the player object and setup the camera and inputs
    this.player = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })

    this.game.add.existing(this.player)

    // Start playing the background music
    this.game.sounds.play('thunderchild', config.MUSIC_VOLUME, true)

    // frame of the game
    this.game.camera.scale.x = 4.2;
    this.game.camera.scale.y = 4.2;
    this.game.camera.follow(this.player);

    // add controls
    this.setupKeyboard();
  }

  setupKeyboard () {
    // W
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    // A
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    // S
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    // D
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  }

  update () {
    // info on screen
    this.game.debug.spriteInfo(this.player, 32, 32);
    this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00');

    // move forward
    if (this.forwardKey.isDown) {
      // if (__DEV__) console.log('forward key')
      this.game.curBoatSpeed = this.game.intBoatSpeed;
      this.player.body.moveForward(this.game.curBoatSpeed);
    } else {
      if (this.game.curBoatSpeed > 0) {
        this.game.curBoatSpeed -= 0.2;
      }
      this.player.body.moveForward(this.game.curBoatSpeed);
    }

    // turn left
    if (this.leftKey.isDown) {
      // if (__DEV__) console.log('left key')
      this.player.body.angle -= this.player.turnangle;
    }

    // move back
    if (this.backwardKey.isDown) {
      // if (__DEV__) console.log('back key')
      if (this.game.curBoatSpeed > 1) {
        this.game.curBoatSpeed--;
      } else {
        this.player.body.moveBackward(this.player.bckspd);
      }
    }
    
    // turn right
    if (this.rightKey.isDown) {
      // if (__DEV__) console.log('right key')
      this.player.body.angle += this.player.turnangle;
    }
  }
}
// Expose the class TestLevel to other files
export default PrototypeLevel1
