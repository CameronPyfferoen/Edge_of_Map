import Phaser from 'phaser'
import config from '../config'
import Test_Snek from '../sprites/Test_Snek'
import PlayerBoat from '../sprites/PlayerBoat'
import BossShip from '../sprites/BossShip'
import GameData from '../GameData'
import EnemyShip from '../sprites/EnemyShip'
import GoldDrop from '../sprites/GoldDrop'
import PortPopup from '../sprites/PortPopup'

class Cam_TestLevel extends Phaser.State {
  init () {
    // Add background Image
    this.game.add.tileSprite(0, 0, 3200, 2048, 'FinalMap')
    // Set pixel smoothing to false
    this.game.stage.smoothed = false
    // Enable p2 physics
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    // Enable FPS counter
    this.game.time.advancedTiming = true
    this.game.time.desiredFPS = 60
    // Set shottype
    this.shotType = GameData.shotTypes.MULTISHOT
  }

  preload () {}

  create () {
    // add tiled map -------------------------------------------------
    this.map = this.game.add.tilemap('map1', 32, 32)

    // Scaling here -------------------------------------------
    this.game.world.setBounds(0, 0, 3200, 2048)
    this.game.world.scale.setTo(2) // 2

    // add world bounds ----------------------------------------------------------
    this.addBounds()

    // set background numbers --------------------------------
    this.game.gold = 0
    this.goldMax = 999999999 // nine spaces
    this.goldMin = 0
    this.game.playerHealth = 100
    this.shotTimerL = 0
    this.shotTimerR = 0
    this.atPort = false
    this.healed = false

    // Add Island Colliders -------------------------------------------------------------------------------
    let customCollider = this.map.objects['GameObjects']
    customCollider.forEach(element => {
      this.Collider = this.add.sprite(element.x, element.y)
      this.game.physics.p2.enable(this.Collider)
      this.Collider.body.addPolygon({}, element.polygon)
      this.Collider.body.static = true
      this.Collider.body.setCollisionGroup(this.game.landGroup)
      this.Collider.body.collides([this.game.playerGroup, this.game.enemyGroup, this.game.cannonballCollisionGroup, this.game.projectileGroup])
    })

    // Start playing the background music -----------------------------
    this.game.mainTheme.play('', 1, config.MUSIC_VOLUME)

    // Add player -----------------------------------------------------
    this.playerMP = new PlayerBoat({
      game: this.game,
      x: 260,
      y: 1950
    }) // x = 260, y = 1950 are the initial spawn points
    // this.playerMP.body.onBeginContact.add(this.rammed, this);
    this.playerMP.death.onComplete.add(this.sendToDead, this)
    this.game.add.existing(this.playerMP)

    // add gold ------------------------------------------------------
    this.goldPos = []
    this.i = 0
    let goldSpawns = this.map.objects['GoldPositions']
    goldSpawns.forEach(element => {
      this.goldPos[this.i] = new GoldDrop({
        game: this.game,
        x: element.x,
        y: element.y
      })
      this.game.add.existing(this.goldPos[this.i])
      this.i++
    })

    // Add port positions ---------------------------------------------------------------------------------------
    this.game.startingPort = new Phaser.Point(203, 1945)
    this.game.skullPort = new Phaser.Point(1528, 1225)
    this.game.crecentPort = new Phaser.Point(2857, 1651)
    this.game.icePort = new Phaser.Point(645, 485)
    this.game.playerPos = new Phaser.Point(this.playerMP.x, this.playerMP.y)

    this.portSignStart = new PortPopup({ game: this.game, x: 203, y: 1945, player: this.playerMP })
    this.portSignSkull = new PortPopup({ game: this.game, x: 1528, y: 1225, player: this.playerMP })
    this.portSignCrecent = new PortPopup({ game: this.game, x: 2857, y: 1651, player: this.playerMP })
    this.portSignIce = new PortPopup({ game: this.game, x: 645, y: 485, player: this.playerMP })
    this.game.add.existing(this.portSignStart);
    this.game.add.existing(this.portSignSkull);
    this.game.add.existing(this.portSignCrecent);
    this.game.add.existing(this.portSignIce);

    // Add Enemies ----------------------------------------------------
    this.sneks = []
    this.i = 0
    let SnakeSpawns = this.map.objects['SnakeSpawn']
    SnakeSpawns.forEach(element => {
      this.sneks[this.i] = new Test_Snek({
        game: this.game,
        x: element.x,
        y: element.y,
        player: this.playerMP
      })
      this.game.add.existing(this.sneks[this.i])
      this.i++
    })

    this.ghostBoats = []
    this.i = 0
    let GhostShipSpawns = this.map.objects['GhostShipSpawn']
    GhostShipSpawns.forEach(element => {
      this.ghostBoats[this.i] = new EnemyShip({
        game: this.game,
        x: element.x,
        y: element.y,
        player: this.playerMP
      })
      this.game.add.existing(this.ghostBoats[this.i])
      this.i++
    })
    
    this.testship = new Test_Snek({
      game: this.game,
      x: this.playerMP.x - 40,
      y: this.playerMP.y - 120,
      player: this.playerMP
    })
    this.game.add.existing(this.testship)
    
    // layer groups ----------------------------------------------------------
    this.underWater = this.game.add.group()
    this.water = this.game.add.group()
    this.aboveWater = this.game.add.group()
    this.playerGroup = this.game.add.group()
    this.game.portMenu = this.game.add.group()
    this.UIback = this.game.add.group()
    this.UImid = this.game.add.group()
    this.UIfwd = this.game.add.group()
    this.game.portTXT = this.game.add.group()
    this.enemies = this.game.add.group()

    // adding the objects to the groups -------------------------------------
    this.playerGroup.add(this.playerMP)

    // Lock camera to player -----------------------------------------------
    this.game.camera.follow(this.playerMP, Phaser.Camera.FOLLOW_LOCKON, 0.01, 0.05) /// 0.1 , 0.1

    // Add keyboard input --------------------------------------------------
    this.setupKeyboard()

    // Adding UI Elements-------------------------------------------------------------------
    this.healthBG = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'healthBG')
    this.healthBar = this.game.add.sprite(this.game.camera.x + 202, this.game.camera.y + 863, 'healthBar')
    this.healthFG = this.game.add.sprite(this.game.camera.x, this.game.camera.y, 'healthFG')
    this.goldTXT = this.game.add.text(this.game.camera.x + 350, this.game.camera.y + 810, '0', {
      font: '65px Arial', // Lucida Handwriting
      fill: '#dad000',
      align: 'left'
    })
    this.goldTXT.stroke = '#000000'
    this.goldTXT.strokeThickness = 6
    this.goldTXT.anchor.setTo(0, 0.5)
    this.game.fullscreen = this.game.add.button(0, 0, 'fullScreen', this.makeFullScreen, this, 1, 0, 1, 0)

    this.UIback.add(this.healthBG)
    this.UIback.add(this.goldTXT)
    this.UImid.add(this.healthBar)
    this.healthBar.cropEnabled = true
    this.UIfwd.add(this.healthFG)
    this.UIfwd.add(this.game.fullscreen)

    this.UIback.fixedToCamera = true
    this.UImid.fixedToCamera = true
    this.UIfwd.fixedToCamera = true

    this.UIback.scale.setTo(1 / 2)
    this.UImid.scale.setTo(1 / 2)
    this.UIfwd.scale.setTo(1 / 2)

    this.game.camera.setPosition(0, 4000)

    // pause listener -----------------------------------------------------------
    window.onkeydown = function (event) {
      if (event.keyCode === 13 || event.keyCode === 32) { // Pressing enter near a port takes you to the port menu
        console.log('Enter Pressed')
        if (!this.atPort) {
          if (Phaser.Math.distance(this.game.startingPort.x, this.game.startingPort.y, this.game.playerPos.x, this.game.playerPos.y) <= 200) {
            console.log('Starting Port is within range!')
            this.atPort = true
            this.pauseBG = this.game.add.sprite(
              this.game.camera.x - this.game.camera.x / 2 + 475,
              this.game.camera.y - this.game.camera.y / 2 + 237.5,
              'startingPort')
            this.pauseBG.anchor.setTo(0.5, 0.5)
            this.pauseBG.scale.setTo(1 / 2)
            this.pauseBG.fixedToCamera = true
            this.game.portMenu.add(this.pauseBG)
            this.goldPortTXT = this.game.add.text(
              this.game.camera.x - this.game.camera.x / 2 + 435,
              this.game.camera.y - this.game.camera.y / 2 + 257.5, '0', {
                font: '65px Arial', // Lucida Handwriting
                fill: '#dad000',
                align: 'center'
              }
            )
            this.goldPortTXT.stroke = '#000000'
            this.goldPortTXT.strokeThickness = 6
            this.goldPortTXT.anchor.setTo(0.5, 0.5)
            this.goldPortTXT.text = (100 - this.game.playerHealth)
            this.goldPortTXT.fixedToCamera = true
            this.goldPortTXT.scale.setTo(1 / 2)
            this.game.portTXT.add(this.goldPortTXT)

            // this.pauseBG.alpha = 0; // can't fade in while the game is paused
            // this.game.add.tween(this.pauseBG).to( { alpha: 1 }, 2000, Phaser.Easing.Linear.None, true, 0, 1000, true);

            this.game.paused = true
          } else if (Phaser.Math.distance(this.game.icePort.x, this.game.icePort.y, this.game.playerPos.x, this.game.playerPos.y) <= 200) {
            console.log('Ice Port is within range!')
            this.atPort = true
            this.pauseBG = this.game.add.sprite(
              this.game.camera.x - this.game.camera.x / 2 + 475,
              this.game.camera.y - this.game.camera.y / 2 + 237.5,
              'icePort')
            this.pauseBG.anchor.setTo(0.5, 0.5)
            this.pauseBG.scale.setTo(1 / 2)
            this.pauseBG.fixedToCamera = true
            this.game.portMenu.add(this.pauseBG)
            this.goldPortTXT = this.game.add.text(
              this.game.camera.x - this.game.camera.x / 2 + 435,
              this.game.camera.y - this.game.camera.y / 2 + 250, '0', {
                font: '65px Arial', // Lucida Handwriting
                fill: '#dad000',
                align: 'center'
              }
            )
            this.goldPortTXT.stroke = '#000000'
            this.goldPortTXT.strokeThickness = 6
            this.goldPortTXT.anchor.setTo(0.5, 0.5)
            this.goldPortTXT.text = (100 - this.game.playerHealth)
            this.goldPortTXT.fixedToCamera = true
            this.goldPortTXT.scale.setTo(1 / 2)
            this.game.portTXT.add(this.goldPortTXT)
            this.game.paused = true
          } else if (Phaser.Math.distance(this.game.skullPort.x, this.game.skullPort.y, this.game.playerPos.x, this.game.playerPos.y) <= 200) {
            console.log('Skull Port is within range!')
            this.atPort = true
            this.pauseBG = this.game.add.sprite(
              this.game.camera.x - this.game.camera.x / 2 + 475,
              this.game.camera.y - this.game.camera.y / 2 + 237.5,
              'skullPort')
            this.pauseBG.anchor.setTo(0.5, 0.5)
            this.pauseBG.scale.setTo(1 / 2)
            this.pauseBG.fixedToCamera = true
            this.game.portMenu.add(this.pauseBG)
            this.goldPortTXT = this.game.add.text(
              this.game.camera.x - this.game.camera.x / 2 + 263,
              this.game.camera.y - this.game.camera.y / 2 + 250, '0', {
                font: '65px Arial', // Lucida Handwriting
                fill: '#dad000',
                align: 'center'
              }
            )
            this.goldPortTXT.stroke = '#000000'
            this.goldPortTXT.strokeThickness = 6
            this.goldPortTXT.anchor.setTo(0.5, 0.5)
            this.goldPortTXT.text = (100 - this.game.playerHealth)
            this.goldPortTXT.fixedToCamera = true
            this.goldPortTXT.scale.setTo(1 / 2)
            this.game.portTXT.add(this.goldPortTXT)
            this.game.paused = true
          } else if (Phaser.Math.distance(this.game.crecentPort.x, this.game.crecentPort.y, this.game.playerPos.x, this.game.playerPos.y) <= 200) {
            console.log('Crecent Port is within range!')
            this.atPort = true
            this.pauseBG = this.game.add.sprite(
              this.game.camera.x - this.game.camera.x / 2 + 475,
              this.game.camera.y - this.game.camera.y / 2 + 237.5,
              'crecentPort')
            this.pauseBG.anchor.setTo(0.5, 0.5)
            this.pauseBG.scale.setTo(1 / 2)
            this.pauseBG.fixedToCamera = true
            this.game.portMenu.add(this.pauseBG)
            this.goldPortTXT = this.game.add.text(
              this.game.camera.x - this.game.camera.x / 2 + 263,
              this.game.camera.y - this.game.camera.y / 2 + 250, '0', {
                font: '65px Arial', // Lucida Handwriting
                fill: '#dad000',
                align: 'center'
              }
            )
            this.goldPortTXT.stroke = '#000000'
            this.goldPortTXT.strokeThickness = 6
            this.goldPortTXT.anchor.setTo(0.5, 0.5)
            this.goldPortTXT.text = (100 - this.game.playerHealth)
            this.goldPortTXT.fixedToCamera = true
            this.goldPortTXT.scale.setTo(1 / 2)
            this.game.portTXT.add(this.goldPortTXT)
            this.game.paused = true
          }
        } else { // If you are already in the port menu pressing enter again heals your ship
          this.game.gold -= (100 - this.game.playerHealth)
          this.game.playerHealth = 100
          if (this.game.gold < 0) {
            this.game.playerHealth += this.game.gold
            this.game.gold = 0
          }
          this.pauseBG.destroy()
          this.goldPortTXT.destroy()
          this.game.healed = true
          this.atPort = false
          this.game.paused = false
        }
      } else if (event.keyCode === 80) { // pressing P pauses the game and brings the controls back up
        this.game.paused = !this.game.paused
        if (this.game.paused) {
          this.pauseBG = this.game.add.sprite(
            this.game.camera.x - this.game.camera.x / 2 + 475,
            this.game.camera.y - this.game.camera.y / 2 + 237.5,
            'controlBoard')
          this.pauseBG.anchor.setTo(0.5, 0.5)
          this.pauseBG.scale.setTo(1 / 2.5)
          this.pauseBG.fixedToCamera = true
        } else { // pressing it again destroys the paused background, or the port menu if that is up
          this.pauseBG.destroy()
          this.atPort = false
        }
      } else if (event.keyCode === 79) { // pressing O to enter or exit fullscreen
        if (this.game.scale.isFullScreen) {
          this.game.scale.stopFullScreen()
          this.game.fullscreen.setFrames(1, 0, 1, 0)
        } else {
          this.game.scale.startFullScreen(false)
          this.game.fullscreen.setFrames(3, 2, 3, 2)
        }
      } else if (event.keyCode === 27) { // on escape
        this.game.fullscreen.setFrames(1, 0, 1, 0)
      }
    }

    // turn off context menu ----------------------------------------------------
    this.game.input.mouse.capture = true
    document.oncontextmenu = function () {
      return false
    }

    this.projectile = this.game.add.physicsGroup(Phaser.Physics.P2JS)
  }

  setupKeyboard () {
    this.forwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.W)
    this.leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.A)
    this.rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.D)
    this.backwardKey = this.game.input.keyboard.addKey(Phaser.Keyboard.S)
    this.escKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ESC)
    this.fireL = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
    this.fireR = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
    this.enterKey = this.game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
  }

  makeFullScreen () {
    this.game.clickSound.play('', 0, config.SFX_VOLUME);
    if (this.game.scale.isFullScreen) {
      this.game.scale.stopFullScreen()
      this.game.fullscreen.setFrames(1, 0, 1, 0)
    } else {
      this.game.scale.startFullScreen(false)
      this.game.fullscreen.setFrames(3, 2, 3, 2)
    }
  }

  sendToDead () {
    this.game.mainTheme.destroy()
    this.state.start('Dead')
  }

  addBounds () {
    this.leftWall = this.game.add.sprite(0, 0, 'nothing')
    this.game.physics.p2.enable(this.leftWall)
    this.leftWall.body.collideWorldBounds = false
    this.leftWall.body.clearShapes()
    this.leftWall.body.addRectangle(50, 4096, 0, 0)
    this.leftWall.body.static = true
    this.leftWall.body.debug = __DEV__
    this.leftWall.body.setCollisionGroup(this.game.landGroup)
    this.leftWall.body.collides([this.game.playerGroup, this.game.enemyGroup])

    this.rightWall = this.game.add.sprite(3200, 0, 'nothing')
    this.game.physics.p2.enable(this.rightWall)
    this.rightWall.body.collideWorldBounds = false
    this.rightWall.body.clearShapes()
    this.rightWall.body.addRectangle(50, 4096, 0, 0)
    this.rightWall.body.static = true
    this.rightWall.body.debug = __DEV__
    this.rightWall.body.setCollisionGroup(this.game.landGroup)
    this.rightWall.body.collides([this.game.playerGroup, this.game.enemyGroup])

    this.botWall = this.game.add.sprite(0, 2048, 'nothing')
    this.game.physics.p2.enable(this.botWall)
    this.botWall.body.collideWorldBounds = false
    this.botWall.body.clearShapes()
    this.botWall.body.addRectangle(6400, 50, 0, 4)
    this.botWall.body.static = true
    this.botWall.body.debug = __DEV__
    this.botWall.body.setCollisionGroup(this.game.landGroup)
    this.botWall.body.collides([this.game.playerGroup, this.game.enemyGroup])

    this.topWall = this.game.add.sprite(0, 0, 'nothing')
    this.game.physics.p2.enable(this.topWall)
    this.topWall.body.collideWorldBounds = false
    this.topWall.body.clearShapes()
    this.topWall.body.addRectangle(6400, 50, 0, -4)
    this.topWall.body.static = true
    this.topWall.body.debug = __DEV__
    this.topWall.body.setCollisionGroup(this.game.landGroup)
    this.topWall.body.collides([this.game.playerGroup, this.game.enemyGroup])
  }

  update () {
    super.update()
    // Update player position for docking at port
    this.game.playerPos.x = this.playerMP.x
    this.game.playerPos.y = this.playerMP.y
    // update health properly -----------------------------
    if (this.game.healed) {
      console.log('old health: ' + this.playerMP.health + ' Healing up to: ' + this.game.playerHealth)
      this.playerMP.health = this.game.playerHealth
      console.log('new health: ' + this.playerMP.health)
      this.game.healed = false
    } else {
      this.game.playerHealth = this.playerMP.health
    }

    // info on screen -----------------------------------------------
    // this.game.debug.spriteInfo(this.playerMP, 32, 32);
    // this.game.debug.text(this.game.time.fps, 5, 14, '#00ff00');

    // Shooting Listener ------------------------------------
    if (this.fireL.isDown) {
      this.shotTimerL = 0
      this.playerMP.firingCallback()
    }

    if (this.fireR.isDown) {
      this.shotTimerR = 0
      this.playerMP.firingCallback2()
    }

    if (this.playerMP.control) {
    // move forward ------------------------
      if (this.playerMP.health > 0) {
        if (this.forwardKey.isDown) {
<<<<<<< HEAD
          this.playerMP.moveForward();
        } else {
          this.playerMP.slowDown();
        }
        // turn left --------------------------
        if (this.leftKey.isDown) {
          this.playerMP.turnLeft();
        }
        // move back --------------------------
        if (this.backwardKey.isDown) {
          this.playerMP.moveBackward();
        }
        // turn right -------------------------
        if (this.rightKey.isDown) {
          this.playerMP.turnRight();
        }
        // Slow down over time ---------------
      } else if (this.playerMP.curBoatSpeed > 0) {
        this.playerMP.moveBackward();
      } else {
        this.playerMP.curBoatSpeed = 0;
      }
    }
    // Zero out angular velocity when not turning -----------
    if (!this.rightKey.isDown && !this.leftKey.isDown) {
      this.playerMP.body.angularVelocity = 0;
=======
          this.playerMP.moveForward()
        } else {
          this.playerMP.slowDown()
        }
        // turn left --------------------------
        if (this.leftKey.isDown) {
          this.playerMP.turnLeft()
        }
        // move back --------------------------
        if (this.backwardKey.isDown) {
          this.playerMP.moveBackward()
        }
        // turn right -------------------------
        if (this.rightKey.isDown) {
          this.playerMP.turnRight()
        }
      // Slow down over time ---------------
      } else if (this.playerMP.curBoatSpeed > 0) {
        this.playerMP.moveBackward()
      } else {
        this.playerMP.curBoatSpeed = 0
      }

      // Zero out angular velocity when not turning -----------
      if (!this.rightKey.isDown && !this.leftKey.isDown) {
        this.playerMP.body.angularVelocity = 0
      }
>>>>>>> a8a87ba3730b66673732cc7791030969252ac464
    }

    // on player death --------------------------------------------
    if (this.playerMP.health <= 0) {
      this.game.input.onDown.removeAll()
      this.game.mainTheme.fadeOut(2250)
      // this.sendToDead();
    }

    // UI update ---------------------------------------------------------
    if (!this.game.scale.isFullScreen) {
      this.game.fullscreen.setFrames(1, 0, 1, 0)
    } else {
      this.game.fullscreen.setFrames(3, 2, 3, 2)
    }
    this.goldTXT.text = this.game.gold
    this.healthBar.width = 538 * (this.playerMP.health / this.playerMP.maxHealth)
  }
}

export default Cam_TestLevel
