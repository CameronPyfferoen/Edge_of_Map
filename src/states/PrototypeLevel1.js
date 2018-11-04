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
    // this.game.width = 762;
    // this.game.heigth = 488;
    this.game.add.tileSprite(0, 0, 3200, 2048, 'backgroundImage');
    this.game.world.setBounds(0, 0, 3200, 2048);
    this.game.time.advancedTiming = true;
    this.game.time.desiredFPS = 60;

    // set the initial and current speeds of the boat
    // this.game.intBoatSpeed = 60;
    // this.game.curBoatSpeed = 0;
  }

  preload () {}

  create () {
    this.map = this.game.add.tilemap('map1', 32, 32);

    this.map.addTilesetImage('landTiles', 'islandSprites');
    this.map.addTilesetImage('Clouds', 'cloudBarrier');

    this.landLayer = this.map.createLayer('Lands');
    this.cloudLayer = this.map.createLayer('Clouds');

    this.landLayer.smoothed = false;
    this.cloudLayer.smoothed = false;

    // create the player object and setup the camera and inputs
    this.player = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })
    this.player.z = 20
    console.log('spawn player at layer '+this.player.z)

    this.game.add.existing(this.player)

    // Start playing the background music
    this.game.sounds.play('thunderchild', config.MUSIC_VOLUME, true)

    // frame of the game
    this.game.cameraScale = 1; // 4.2
    this.game.camera.scale.x = this.game.cameraScale; 
    this.game.camera.scale.y = this.game.cameraScale; 
    this.game.camera.view.x = 762;
    this.game.camera.view.y = 488;
    this.game.camera.follow(this.player, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)

    /*
    this.game.mapScale = 1;
    this.landLayer.scale.x = this.game.mapScale;
    this.landLayer.scale.y = this.game.mapScale;

    this.cloudLayer.scale.x = this.game.mapScale;
    this.cloudLayer.scale.y = this.game.mapScale;
    */

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
      this.player.moveForward();
    } else {
      this.player.slowDown();
    }

    // turn left
    if (this.leftKey.isDown) {
      // if (__DEV__) console.log('left key')
      this.player.turnLeft();
    }

    // move back
    if (this.backwardKey.isDown) {
      // if (__DEV__) console.log('back key')
      this.player.moveBackward();
    }

    // turn right
    if (this.rightKey.isDown) {
      // if (__DEV__) console.log('right key')
      this.player.turnRight();
    }
  }
}
// Expose the class TestLevel to other files
export default PrototypeLevel1
