import Phaser from 'phaser'
import config from '../config'
import { Sprite } from 'phaser-ce'
import Test_Snek from '../sprites/Test_Snek'
import Crab_Blue from '../sprites/Crab_Blue'
import Crab_Orange from '../sprites/Crab_Orange'
import Kraken from '../sprites/Kraken'
import Megalodon from '../sprites/Megalodon'
import Pirhanas from '../sprites/Pirhanas'
import Jellyfish from '../sprites/Jellyfish'
import PlayerBoat from '../sprites/PlayerBoat'
import Test_Cannonball from '../sprites/Test_Cannonball'
import FiringTest from '../states/FiringTest'
import GameData from '../GameData'
import Shark from '../sprites/Shark'

class Cam_TestLevel extends Phaser.State {
  init () {
    this.game.add.tileSprite(0, 0, 3200, 2048, 'comboMap'); // 'backGroundImage'
    this.game.stage.smoothed = false;
    this.game.physics.startSystem(Phaser.Physics.P2JS);
    this.game.time.advancedTiming = true
    this.game.time.desiredFPS = 60
    this.shotType = GameData.shotTypes.MULTISHOT
  }

  preload () {}

  create () {
    // add tiled map -------------------------------------------------
    this.map = this.game.add.tilemap('map1', 32, 32)
    // this.map.addTilesetImage('Clouds', 'cloudBarrier')
    // this.cloudLayer = this.map.createLayer('Clouds')
    /*
    this.map.addTilesetImage('landTiles', 'islandSprites')
    this.landLayer = this.map.createLayer('Lands')
    */
    // Scaling black magic here --------------------------------
    this.game.world.scale.setTo(2) // 2
    this.game.world.setBounds(0, 0, 3200, 2048)
    this.game.physics.p2.setBounds(0, 0, 3200, 2048)

    /*
    this.cloudLayer.scale.set(1.78)
    this.cloudLayer.smoothed = false
    this.cloudLayer.autoCull = true
    /*
    this.landLayer.scale.set(1.78)
    this.landLayer.smoothed = false
    */
    /*
    let skullPoly = this.map.objects['GameObjects'][1]
    this.skullIslandTop = this.game.add.sprite(skullPoly.x, skullPoly.y)
    this.game.physics.p2.enable(this.skullIslandTop)
    this.skullIslandTop.body.debug = __DEV__
    this.skullIslandTop.body.addPolygon({}, skullPoly.polygon)
    this.skullIslandTop.body.static = true
    this.skullIslandTop.body.setCollisionGroup(this.game.landGroup)
    this.skullIslandTop.body.collides([this.game.playerGroup, this.game.enemyGroup])
    */

    let customCollider = this.map.objects['GameObjects']
    customCollider.forEach(element => {
      this.Collider = this.add.sprite(element.x, element.y)
      this.game.physics.p2.enable(this.Collider)
      // this.Collider.body.debug = __DEV__
      this.Collider.body.addPolygon({}, element.polygon)
      this.Collider.body.static = true
      this.Collider.body.setCollisionGroup(this.game.landGroup)
      this.Collider.body.collides([this.game.playerGroup, this.game.enemyGroup])
    })

    // Start playing the background music -----------------------------
    // this.game.sounds.play('thunderchild', config.MUSIC_VOLUME, true)

    // Add player -----------------------------------------------------
    this.playerMP = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1850
    })
    this.playerMP.body.onBeginContact.add(this.rammed, this)
    this.playerMP.body.collideWorldBounds = true; // broken as hell
    this.gold = 123456789;
    this.goldMax = 999999999;
    this.goldMin = 0;

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
    // Add Enemies ----------------------------------------------------
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
    // this.playerMP.body.rotation = 1.57; // uses radians

    // layer groups ----------------------------------------------------------
    this.underWater = this.game.add.group()
    this.water = this.game.add.group()
    this.aboveWater = this.game.add.group()
    this.playerGroup = this.game.add.group()
    this.UIback = this.game.add.group()
    this.UImid = this.game.add.group()
    this.UIfwd = this.game.add.group()

    this.enemies = this.game.add.group()
    for (let k = 0; k < 10; k++) {
      this.enemies.add(this.sneks[k])
      this.underWater.add(this.sneks[k])
    }

    // adding the objects to the groups -------------------------------------
    this.playerGroup.add(this.playerMP);
    /*
    this.aqua = this.game.add.sprite(0, 0,'mapoverlay');
    this.water.add(this.aqua);
    */
    /*
    this.aboveWater.add(this.landLayer);
    this.aboveWater.add(this.cloudLayer);
    */

    this.game.camera.follow(this.playerMP, Phaser.Camera.FOLLOW_LOCKON, 0.01, 0.05); /// 0.1 , 0.1

    this.setupKeyboard()

    // UI -------------------------------------------------------------------
    this.healthBG = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'healthBG');
    this.healthBar = this.game.add.sprite(this.game.camera.x + 202, this.game.camera.y + 863, 'healthBar');
    this.healthFG = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'healthFG');
    this.goldTXT = this.game.add.text(this.game.camera.x + 350, this.game.camera.y + 810, '0', {
      font: '65px Arial', // Lucida Handwriting
      fill: '#dad000',
      align: 'left'
    });
    this.goldTXT.stroke = '#000000';
    this.goldTXT.strokeThickness = 6;
    this.goldTXT.anchor.setTo(0, 0.5);

    this.UIback.add(this.healthBG);
    this.UIback.add(this.goldTXT);
    this.UImid.add(this.healthBar);
    this.healthBar.cropEnabled = true;
    this.UIfwd.add(this.healthFG);

    this.UIback.fixedToCamera = true;
    this.UImid.fixedToCamera = true;
    this.UIfwd.fixedToCamera = true;

    this.UIback.scale.setTo(1 / 2);
    this.UImid.scale.setTo(1 / 2);
    this.UIfwd.scale.setTo(1 / 2);

    this.game.camera.x = this.playerMP.body.x;
    this.game.camera.y = this.playerMP.body.y;
    /*
    this.cropRect = Phaser.Rectangle(0, 0, 0, this.healthBar.width);
    this.healthBar.crop(this.cropRect);
    */

    // pause listener -----------------------------------------------------------
    window.onkeydown = function (event) {
      if (event.keyCode === 27) {
        this.game.paused = !this.game.paused;
        if (this.game.paused) {
          this.pauseBG = this.game.add.sprite(this.game.camera.x + 950 - 1165/2, this.game.camera.y + 475 - 394, 'controlBoard');
          this.menuButton = this.game.add.button(this.game.camera.x + 950 - 179, this.game.camera.y + 475 + 180, 'exitButton', this.sendToMain, this, 1, 0, 1, 0);
          this.pauseBG.fixedToCamera = true;
          this.menuButton.fixedToCamera = true;
          // this.pauseBG = this.game.add.sprite(this.game.center.x /*+ 950 - 1165/2*/, this.game.center.y, 'controlBoard');
          // this.menuButton = this.game.add.button(this.game.center.x /*+ 950 - 179*/, this.game.center.y /*+ 475 + 180*/, 'exitButton', this.sendToMain, this, 1, 0, 1, 0);
          this.pauseBG.scale.setTo(1 / 4);
          this.menuButton.scale.setTo(1 / 4);
          // this.UIfwd.add(this.pauseBG);
          // this.UIfwd.add(this.menuButton);
        } else {
          this.pauseBG.destroy();
          this.menuButton.destroy();
        }
      }
    };


    // turn off context menu
    this.game.input.mouse.capture = true
    document.oncontextmenu = function () {
      return false
    }

    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)


    // changed addeventlisteners... this.firingCallback.bind(this) to this.playerMP.firingCallback.bind(this.playerMP)
    // addEventListener('click', this.firingCallback.bind(this))
    // addEventListener('contextmenu', this.firingCallback2.bind(this))
    addEventListener('click', this.playerMP.firingCallback.bind(this.playerMP))
    addEventListener('contextmenu', this.playerMP.firingCallback2.bind(this.playerMP))

    // destroy projectiles when they collide w/ PLAYER
    // this.playerMP.body.collides(this.cannonballCollisionGroup, this.hitCannonball, this)
    // this.playerMP.body.collides(this.cannonballCollisionGroup, this.hitCannonball, this)

  }

  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W);
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A);
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D);
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S);
    this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC);
  }

  rammed () {

  }

  sendToMain () {
    this.state.start('MainMenu');
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

    if (!this.rightKey.isDown && !this.leftKey.isDown) {
      this.playerMP.body.angularVelocity = 0;
    }

    // UI update
    this.goldTXT.text = this.gold;
    this.healthBar.width = 538 * (this.playerMP.health / this.playerMP.maxHealth);
    /*
    this.cropRect.width = 538 * (this.playerMP.health / this.playerMP.maxHealth);
    this.healthBar.updateCrop();
    */
  }
}

export default Cam_TestLevel
