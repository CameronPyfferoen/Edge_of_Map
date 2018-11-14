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
import Test_Cannonball from '../sprites/Test_Cannonball'
import FiringTest from '../states/FiringTest'
import GameData from '../GameData'
import Shark from '../sprites/Shark';



class Cam_TestLevel extends Phaser.State {
  init () {
    this.game.add.tileSprite(0, 0, 3200, 2048, 'backgroundImage');
    this.game.world.setBounds(0, 0, 3200, 2048);
    this.game.time.advancedTiming = true
    this.game.time.desiredFPS = 60
    this.shotType = GameData.shotTypes.MULTISHOT
  }

  preload () {}

  create () {

    this.game.physics.p2.updateBoundsCollisionGroup();

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
    
    let skullPoly = this.map.objects['GameObjects'][1]; 
    this.skullIslandTop = this.game.add.sprite(skullPoly.x, skullPoly.y);
    this.game.physics.p2.enable(this.skullIslandTop);
    this.skullIslandTop.body.debug = __DEV__;
    this.skullIslandTop.body.addPolygon({}, skullPoly.polygon);
    this.skullIslandTop.body.static = true;
    this.skullIslandTop.body.setCollisionGroup(this.game.landGroup);
    this.skullIslandTop.body.collides([this.game.playerGroup, this.game.enemyGroup]);

    // Start playing the background music
    // this.game.sounds.play('thunderchild', config.MUSIC_VOLUME, true)

    this.playerMP = new PlayerBoat({
      game: this.game,
      x: this.world.centerX - 300,
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

    // turn off context menu
    this.game.input.mouse.capture = true
    document.oncontextmenu = function () {
      return false
    }

    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)


    // CANNOT USE FIRINGCALLBACK, TRY REFERENCING IT FROM TEST_CANNONBALL
    // right and left click input
    // addEventListener('click', this.firingCallback.bind(this))
    // addEventListener('contextmenu', this.firingCallback2.bind(this))
    addEventListener('click', this.playerMP.firingCallback.bind(this.playerMP))
    addEventListener('contextmenu', this.playerMP.firingCallback2.bind(this))

    // destroy projectiles when they collide w/ PLAYER
    // this.playerMP.body.collides(this.cannonballCollisionGroup, this.hitCannonball, this)

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

    if (!this.rightKey.isDown && !this.leftKey.isDown) {
      this.playerMP.body.angularVelocity = 0;
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

  // // COMMENT ALMOST EVERYTHING BELOW
  // // Delete projectiles after x amount of seconds or collision
  // hitCannonball (body1, body2) {
  //   // body1 is the ship (as it's the body that owns the callback)
  //   // body2 is the body it impacted with, in this case projectiles

  //   // body2.sprite.kill()
  //   // for some reason, the line of code below, relating to destory, causes the game to crash after the player collides with the projectile
  //   body2.destroy()
  // }

  // // Choose projectile type for the left side of the ship
  // firingCallback () {
  //   switch (this.playerMP.shotType) {
  //     case GameData.shotTypes.HARPOON:
  //       this.harpoon()
  //       break
  //     case GameData.shotTypes.MULTISHOT:
  //       this.spreadShotLeft()
  //       break
  //     case GameData.shotTypes.EXTRA:
  //       //
  //       break
  //     default:
  //   }
  //   // this.spreadShotLeft()
  //   // this.harpoon()
  // }

  // // Choose projectile type for the right side of the ship
  // firingCallback2 () {
  //   // this.spreadShotRight()
  // }

  // // DOES NOT WORK ATM
  // // Firing rate for the left side of the ship
  // firingCallbackCooldown () {
  //   if (this.timer == 0) {
  //     this.firingCallback()
  //     this.timer = 4000
  //     while (this.timer > 0) {
  //       this.timer--
  //     }
  //   }
  // }

  // // DOES NOT WORK ATM
  // // Firing rate for the right side of the ship
  // firingCallbackCooldown2 () {
  //   if (this.timer2 == 0) {
  //     this.firingCallback2()
  //     this.timer2 = 4000
  //     while (this.timer2 > 0) {
  //       this.timer2--
  //     }
  //   }
  // }

  // harpoon () {
  //   console.log('o')
  //   let mousex = this.game.input.x
  //   let mousey = this.game.input.y
  //   console.log('MousePos: [' + mousex + ',' + mousey + ']')
  //   let shipx = this.playerMP.x / 2
  //   let shipy = this.playerMP.y / 2
  //   console.log('ShipPos: [' + shipx + ',' + shipy + ']')
  //   let directionx = mousex - shipx
  //   let directiony = mousey - shipy
  //   let magnitude = Math.sqrt(((Math.pow(directionx, 2)) + (Math.pow(directiony, 2))))
  //   let unitx = directionx / magnitude
  //   let unity = directiony / magnitude
  //   let harpoonAngle = (Math.atan(directiony / directionx) * (180 / Math.PI) )
  //   console.log('DIRECTION: [' + directionx + ',' + directiony + ']')
  //   let cannonball = new Test_Cannonball({
  //     game: this.game,
  //     x: this.playerMP.x,
  //     y: this.playerMP.y
  //   })

  //   this.projectile.add(cannonball)
  //   this.cannonball.body.setRectangle(2, 2)
  //   this.cannonball.body.setCollisionGroup(this.cannonballCollisionGroup)

  //   this.cannonballWidth = 10
  //   this.cannonballHeight = 20

  //   if (harpoonAngle > 0) {
  //     this.cannonball.body.angle = harpoonAngle - 90
  //   }
  //   else {
  //     this.cannonball.body.angle = harpoonAngle + 90
  //   }

  //   this.cannonball.body.velocity.x = unitx * 500
  //   this.cannonball.body.velocity.y = unity * 500

  //   console.log(harpoonAngle)


  //   // let shipP = new Phaser.Point(shipx, shipy)
  //   // let mouseP = new Phaser.Point(mousex, mousey)
  //   // cannonball.body.angle = shipP.angle(mouseP)

  //   // cannonball.angle = Math.atan2(mousey - shipy, mousex - shipx)

  //   // cannonball.body.moveForward(1000)


  //   this.cannonball.width = this.cannonballWidth
  //   this.cannonball.height = this.cannonballHeight

  //   // this.game.p2.moveToPointer(cannonball, 100)
  // }

  // spreadShotLeft () {
  //   // Create projectile object
  //   console.log('o')
  //   let cannonball = new Test_Cannonball({
  //     game: this.game,
  //     x: this.playerMP.x,
  //     y: this.playerMP.y
  //   })
  //   let cannonball2 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.playerMP.x,
  //     y: this.playerMP.y + 7.5
  //   })
  //   let cannonball3 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.playerMP.x,
  //     y: this.playerMP.y - 7.5
  //   })
  //   // Add sprite to the projectile physics group
  //   this.projectile.add(this.cannonball)
  //   this.projectile.add(this.cannonball2)
  //   this.projectile.add(this.cannonball3)

  //   // Set hitbox size for projectile
  //   this.cannonball.body.setRectangle(2, 2)
  //   this.cannonball2.body.setRectangle(2, 2)
  //   this.cannonball3.body.setRectangle(2, 2)
  //   // Tell cannonball to use cannonballCollisionGroup
  //   this.cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
  //   this.cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
  //   this.cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

  //   //  Cannonballs will collide against themselves and the player
  //   //  If this is not set, cannonballs will not collide with anything
  //   // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

  //   // Set projectile sprite size, spawn location, and velocity
  //   this.cannonballWidth = 10
  //   this.cannonballHeight = 20

  //   // Set cannonball angle, velocity, and size
  //   this.cannonball.body.angle = this.playerMP.angle - 90
  //   this.cannonball.body.moveForward(500)
  //   this.cannonball.width = this.cannonballWidth
  //   this.cannonball.height = this.cannonballHeight

  //   // cannonball2.x = this.playerMP.angle + 100
  //   // cannonball2.y = this.playerMP.angle + 100
  //   this.cannonball2.body.angle = this.playerMP.angle - 90
  //   this.cannonball2.body.moveForward(500)
  //   this.cannonball2.width = this.cannonballWidth
  //   this.cannonball2.height = this.cannonballHeight

  //   // cannonball3.x = this.playerMP.angle - 100
  //   // cannonball3.y = this.playerMP.angle - 100
  //   this.cannonball3.body.angle = this.playerMP.angle - 90
  //   this.cannonball3.body.moveForward(500)
  //   this.cannonball3.width = this.cannonballWidth
  //   this.cannonball3.height = this.cannonballHeight
  // }

  // spreadShotRight () {
  //   // Create projectile object
  //   console.log('o')
  //   let cannonball = new Test_Cannonball({
  //     game: this.game,
  //     x: this.playerMP.x,
  //     y: this.playerMP.y
  //   })
  //   let cannonball2 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.playerMP.x,
  //     y: this.playerMP.y + 7.5
  //   })
  //   let cannonball3 = new Test_Cannonball({
  //     game: this.game,
  //     x: this.playerMP.x,
  //     y: this.playerMP.y - 7.5
  //   })
  //   // Add sprite to the projectile physics group
  //   this.projectile.add(this.cannonball)
  //   this.projectile.add(this.cannonball2)
  //   this.projectile.add(this.cannonball3)

  //   // Set hitbox size for projectile
  //   this.cannonball.body.setRectangle(2, 2)
  //   this.cannonball2.body.setRectangle(2, 2)
  //   this.cannonball3.body.setRectangle(2, 2)
  //   // Tell cannonball to use cannonballCollisionGroup
  //   this.cannonball.body.setCollisionGroup(this.game.cannonballCollisionGroup)
  //   this.cannonball2.body.setCollisionGroup(this.game.cannonballCollisionGroup)
  //   this.cannonball3.body.setCollisionGroup(this.game.cannonballCollisionGroup)

  //   //  Cannonballs will collide against themselves and the player
  //   //  If this is not set, cannonballs will not collide with anything
  //   // cannonball.body.collides([this.cannonballCollisionGroup, this.playerCollisionGroup])

  //   // Set projectile sprite size, spawn location, and velocity
  //   this.cannonballWidth = 10
  //   this.cannonballHeight = 20

  //   // Set cannonball angle, velocity, and size
  //   this.cannonball.body.angle = this.playerMP.angle + 90
  //   this.cannonball.body.moveForward(500)
  //   this.cannonball.width = this.cannonballWidth
  //   this.cannonball.height = this.cannonballHeight

  //   // cannonball2.x = this.playerMP.angle + 10
  //   // cannonball2.y = this.playerMP.angle + 10
  //   this.cannonball2.body.angle = this.playerMP.angle + 90
  //   this.cannonball2.body.moveForward(500)
  //   this.cannonball2.width = this.cannonballWidth
  //   this.cannonball2.height = this.cannonballHeight

  //   // cannonball3.x = this.playerMP.angle + 10
  //   // cannonball3.y = this.playerMP.angle + 10
  //   this.cannonball3.body.angle = this.playerMP.angle + 90
  //   this.cannonball3.body.moveForward(500)
  //   this.cannonball3.width = this.cannonballWidth
  //   this.cannonball3.height = this.cannonballHeight
  // }
}

export default Cam_TestLevel
