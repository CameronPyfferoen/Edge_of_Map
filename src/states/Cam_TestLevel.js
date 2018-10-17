import Phaser from 'phaser';
import config from '../config';
import Test_Snek from '../sprites/Test_Snek';
import { Sprite } from 'phaser-ce';
import PlayerBoat from '../sprites/PlayerBoat';


class Cam_TestLevel extends Phaser.State {
  init () {
    this.game.add.tileSprite(0, 0, 3149, 2007, 'map')
    this.game.world.setBounds(0, 0, 3149, 2007)
    this.game.time.advancedTiming = true
    this.game.time.desiredFPS = 60
  }

  preload () {}

  create () {
    this.playerMP = new PlayerBoat({
      game: this.game,
      x: this.world.centerX - 100,
      y: this.world.centerY
    })

    this.snek = new Test_Snek({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY + 32,
      player: this.playerMP,
      camera: this.game.world.camera
    })

    this.game.add.existing(this.playerMP)
    this.game.add.existing(this.snek)

    // layer groups
    this.underWater = this.game.add.group()
    this.water = this.game.add.group()
    this.aboveWater = this.game.add.group()
    this.playerGroup = this.game.add.group()

    // adding the objects to the groups
    // this.water.add(1574.5, 1003.5, 'mapoverlay')
    this.playerGroup.add(this.playerMP)
    this.underWater.add(this.snek)

    // this.worldsprites = []
    // this.numsprites = 0

    this.game.camera.scale.x = 4.2
    this.game.camera.scale.y = 4.2
    this.game.camera.follow(this.playerMP)

    this.setupKeyboard()
  }

  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
  }

  update () {
    super.update()
    // info on screen
    this.game.debug.spriteInfo(this.playerMP, 32, 32);
    this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00');

    // move forward
    if (this.forwardKey.isDown) {
      // if (__DEV__) console.log('forward key')
      this.playerMP.moveForward();
    } else {
      this.playerMP.slowDown();
    }

    // turn left
    if (this.leftKey.isDown) {
      // if (__DEV__) console.log('left key')
      this.playerMP.turnLeft();
    }

    // move back
    if (this.backwardKey.isDown) {
      // if (__DEV__) console.log('back key')
      this.playerMP.moveBackward();
    }

    // turn right
    if (this.rightKey.isDown) {
      // if (__DEV__) console.log('right key')
      this.playerMP.turnRight();
    }
  }
}

export default Cam_TestLevel
