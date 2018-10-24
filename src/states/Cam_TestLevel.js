import Phaser from 'phaser';
import config from '../config'
import { Sprite } from 'phaser-ce';
import Test_Snek from '../sprites/Test_Snek'
import Crab_Blue from '../sprites/Crab_Blue'
import Crab_Orange from '../sprites/Crab_Orange'
import Kraken from '../sprites/Kraken'
import Megalodon from '../sprites/Megalodon'
import Pirhanas from '../sprites/Pirhanas'
import Jellyfish from '../sprites/Jellyfish'
import PlayerBoat from '../sprites/PlayerBoat'
import Shark from '../sprites/Shark';


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

    this.bcrab = new Crab_Blue({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY,
      player: this.playerMP
    })
    this.game.add.existing(this.bcrab)

    this.shark = new Shark({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY - 50,
      player: this.playerMP
    })
    this.game.add.existing(this.shark)

    this.sneks = []
    for (let i = 0; i < 10; i++) {
      this.sneks[i] = new Test_Snek({
        game: this.game,
        x: Phaser.Math.random(0, 3149),
        y: Phaser.Math.random(0, 2007),
        player: this.playerMP
      })

      this.game.add.existing(this.sneks[i])
    }

    // land testing
    this.port0 = this.game.add.sprite(200, 500, 'starting_port')
    this.game.physics.p2.enable(this.port0, true)
    this.port0.body.clearShapes()
    this.port0.body.loadPolygon('physicsList', 'Starting_Port')
    this.port0.body.gravityScale = 0
    this.game.add.existing(this.playerMP)

    // layer groups
    this.underWater = this.game.add.group()
    this.water = this.game.add.group()
    this.aboveWater = this.game.add.group()
    this.playerGroup = this.game.add.group()

    this.enemies = this.game.add.group()
    for (let k = 0; k < 10; k++) {
      this.enemies.add(this.sneks[k])
      this.underWater.add(this.sneks[k])
    }

    // adding the objects to the groups
    // this.underWater.add(this.snek)
    this.playerGroup.add(this.playerMP)
    this.aboveWater.add(this.port0)
    this.aqua = this.game.add.sprite(0, 0, 'mapoverlay')
    this.water.add(this.aqua)
    // this.worldsprites = []
    // this.numsprites = 0

    this.game.camera.scale.x = 1 // 4.2
    this.game.camera.scale.y = 1 // 4.2
    this.game.camera.follow(this.playerMP, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1)

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

    this.aqua.x = this.playerMP.body.x - 250;
    this.aqua.y = this.playerMP.body.y - 130;
  }
}

export default Cam_TestLevel
