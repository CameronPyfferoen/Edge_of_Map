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
    this.game.add.tileSprite(0, 0, 3200, 2048, 'backgroundImage');
    this.game.world.setBounds(0, 0, 3200, 2048);
    this.game.time.advancedTiming = true
    this.game.time.desiredFPS = 60
  }

  preload () {}

  create () {
    // add tiled map
    this.map = this.game.add.tilemap('map1', 32, 32);

    this.map.addTilesetImage('landTiles', 'islandSprites');
    this.map.addTilesetImage('Clouds', 'cloudBarrier');

    this.landLayer = this.map.createLayer('Lands');
    this.cloudLayer = this.map.createLayer('Clouds');
    // Scaling black magic here
    this.game.world.scale.setTo(1); // 2
    //this.cloudLayer.scale.set(1.78);
    //this.landLayer.scale.set(1.78);
    // this.cloudLayer.resizeWorld();
    this.landLayer.smoothed = false;
    this.cloudLayer.smoothed = false;
    /*
    this.skullIslandTop = this.game.add.sprite(1509.21, 912.51);
    this.game.physics.p2.enable(this.skullIslandTop, true);
    this.skullIslandTop.body.clearShapes();
    this.skullIslandTop.body.loadPolygon('GameObjects', 'Skull_Island_Top');
    */
    this.skullIslandTop = this.game.add.sprite(1509.21, 912.51);
    this.game.physics.p2.enable(this.skullIslandTop, true);
    this.skullIslandTop.body.clearShapes();
    this.skullIslandTop = this.map.objects['GameObjects'][6]; 
    // this.skullIslandTop.body.debug = __DEV__;
  

    // Start playing the background music
    this.game.sounds.play('thunderchild', config.MUSIC_VOLUME, true)

    this.playerMP = new PlayerBoat({
      game: this.game,
      x: this.world.centerX,
      y: this.world.centerY
    })
    /*
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

    this.meg = new Megalodon({
      game: this.game,
      x: this.world.centerX + 30,
      y: this.world.centerY,
      player:this.playerMP
    })
    this.game.add.existing(this.meg)
    */
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

    this.test_fire = new Test_Snek({
      game: this.game,
      x: this.world.centerX + 50,
      y: this.world.centerY + 50,
      player: this.playerMP
    })
    this.game.add.existing(this.test_fire)

    this.game.add.existing(this.playerMP)
    this.playerMP.body.rotation = 1.57; // uses radians 

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
    this.playerGroup.add(this.playerMP)
    /*
    this.aqua = this.game.add.sprite(0, 0,'mapoverlay')
    this.water.add(this.aqua)
    */
    this.aboveWater.add(this.landLayer);
    this.aboveWater.add(this.cloudLayer);

    this.game.camera.follow(this.playerMP, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    this.setupKeyboard()
    
    // pause listener
    window.onkeydown = function (event) { 
      if (event.keyCode === 27) {
        this.game.paused = !this.game.paused;
      }
    };
    
  }

  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
  }

  update () {
    super.update()
    // info on screen
    this.game.debug.spriteInfo(this.playerMP, 32, 32);
    this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00');

    // move forward
    if (this.forwardKey.isDown) {
      this.playerMP.moveForward();
    } else {
      this.playerMP.slowDown();
    }

    // turn left
    if (this.leftKey.isDown) {
      this.playerMP.turnLeft();
    }

    // move back
    if (this.backwardKey.isDown) {
      this.playerMP.moveBackward();
    }

    // turn right
    if (this.rightKey.isDown) {
      this.playerMP.turnRight();
    }
    /*
    if (this.escKey.isDown) {
      this.setPause();
    }
    */
    // this.aqua.x = this.playerMP.body.x - 250;
    // this.aqua.y = this.playerMP.body.y - 130;
    // this.aqua.x = this.game.camera.position.x - 250;
    // this.aqua.y = this.game.camera.position.y - 130;
  }
}

export default Cam_TestLevel
