// Import the entire 'phaser' namespace
import Phaser from 'phaser'
import P2 from 'p2'

// Import needed functions from utils and config settings
import { centerGameObjects } from '../utils'
import config from '../config'

/**
 * The Splash game state. This game state displays a dynamic splash screen used
 * to communicate the progress of asset loading. It should ensure it is always
 * displayed some mimimum amount of time (in case the assets are already cached
 * locally) and it should have pre-loaded any assets it needs to display in Boot
 * before it is run. Generally only runs once, after Boot, and cannot be re-entered.
 *
 * See Phaser.State for more about game states.
 */
class Splash extends Phaser.State {
  // Initialize some local settings for this state
  init () {
    // When was this state started?
    this.started = this.game.time.time

    // Set / Reset world bounds
    this.game.world.setBounds(0, 0, this.game.width, this.game.height)

    // // Add the logo to the screen and center it
    // this.logo = this.game.add.sprite(
    //   this.game.world.centerX, this.game.world.centerY + 100, 'ourLogo')
    // centerGameObjects([this.logo])
  }

  preload () {
    // Create sprites from the progress bar assets
    this.loaderBg = this.add.sprite(
      this.game.world.centerX, this.game.world.centerY + 500, 'loaderBg')
    this.loaderBar = this.add.sprite(
      this.game.world.centerX, this.game.world.centerY + 500, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    // Display the progress bar
    this.load.setPreloadSprite(this.loaderBar)
    this.startLogoSequence()

    // Load all the assets needed for next state ------------------------------------------------------------------------

    // The main player spritesheet
    this.load.spritesheet('player-med', './assets/images/PLayer_M_Ship_96x96/Player_M_96_Sprite_Sheet.png', 96, 96)
    this.load.spritesheet('cannonball', 'assets/images/Player/Projectiles_75_opacity.png', 32, 32)
    this.load.spritesheet('cannonball2', 'assets/images/Projectils_Sprite_Sheet_32px.png', 32, 32)

    this.load.spritesheet('seasnake', 'assets/images/Enemies/SpriteSheet_SeaSnake.png', 64, 128)
    this.load.spritesheet('seasnake_death', 'assets/images/Enemies/SpriteSheet_SeaSnake_Death.png', 64, 128)
    this.load.spritesheet('seasnake_attack', './assets/images/Enemies/SpriteSheet_SeaSnake_Attack_FullBody.png', 64, 128)
    this.load.spritesheet('fireball', './assets/images/Enemies/SpriteSheet_SeaSnake_Attack_FireBall.png', 16, 32)
    this.load.spritesheet('sharkSheet', './assets/images/Enemies/SpriteSheet_Shark.png', 32, 48)
    // this.load.spritesheet('medBoat', 'assets/images/Player/Player_M_96.png', 96, 96)
    // this.load.spritesheet('wake', 'assets/images/Player/spr_wake_8x8.png', 8, 8)
    // this.load.spritesheet('mapoverlay', 'assets/images/Terrain/maptemplatewater.png', 500, 260)

    // Pickups
    this.load.spritesheet('pickups', './assets/images/Pickups/pickups_Sprite_Sheet.png', 64, 64)

    // Tiled Physics
    this.load.physics('GameObjects', '/assets/maps/FinalMap.json')
    this.load.physics('SnakeSpawn', '/assets/maps/FinalMap.json')
    this.load.physics('GhostShipSpawn', '/assets/maps/FinalMap.json')
    this.load.physics('GoldPositions', '/assets/maps/FinalMap.json')

    // this.load.physics('GameObjects', '/assets/maps/TestingTiledV2.json')

    // Enemies
    this.load.spritesheet('seasnake_final', 'assets/images/Enemies/SpriteSheet_SeaSnake_BothFull.png', 64, 160)
    this.load.spritesheet('seasnake_all', 'assets/images/Enemies/SpriteSheet_SeaSnake_All.png', 64, 160)
    this.load.spritesheet('enemyship', 'assets/images/Enemies/Enemy_Ships_L_128.png', 128, 128)
    this.load.spritesheet('fireball', './assets/images/Enemies/SpriteSheet_SeaSnake_Attack_FireBall.png', 16, 32)
    this.load.spritesheet('seasnake', 'assets/images/Enemies/SpriteSheet_SeaSnake.png', 64, 128)
    this.load.spritesheet('seasnake_attack', './assets/images/Enemies/SpriteSheet_SeaSnake_Attack_FullBody.png', 64, 128)
    this.load.spritesheet('sharkSheet', './assets/images/Enemies/SpriteSheet_Shark.png', 32, 48)
    this.load.spritesheet('bossSheet', 'assets/images/Enemies/Boss_Ship_01_Sprite_Sheet.png', 288, 288)

    this.load.image('seasnake_still', './assets/images/Enemies/seasnake_16x.png')
    this.load.image('bluecrab', './assets/images/Enemies/crab_blue.png')
    this.load.image('orangecrab', './assets/images/Enemies/crab_orange.png')
    this.load.image('jellyfish', './assets/images/Enemies/jellyfish_swarm.png')
    this.load.image('kraken', './assets/images/Enemies/kraken_wip.png')
    this.load.image('megalodon', './assets/images/Enemies/meg_wip.png')
    this.load.image('pirhanas', './assets/images/Enemies/piranha_swarm.png')

    // Tilemap Assets
    this.load.tilemap('map1', './assets/maps/FinalMap.json', null, Phaser.Tilemap.TILED_JSON) // it needs this
    this.load.image('FinalMap', './assets/images/Terrain/Map_With_Border.png')
    this.load.image('nothing', './assets/images/Terrain/spr_nothing.png')
    this.load.image('backgroundImage', './assets/images/Terrain/maptemplatewater (1).png')
    this.load.image('islandSprites', './assets/images/Terrain/inprogress_map_template_no_back.png')
    this.load.image('cloudBarrier', './assets/images/Terrain/cloudedge.png')
    this.load.image('comboMap', './assets/images/Terrain/mapCombo.png')

    // Menu Assets
    this.load.image('mainMenuBackground', './assets/images/UI/menu_main_background.png')
    this.load.image('settingsMenuBoard', './assets/images/UI/menu_main_board.png')
    this.load.spritesheet('playButton', './assets/images/UI/SpriteSheet_main_play.png', 358, 121)
    this.load.spritesheet('controlsButton', './assets/images/UI/SpriteSheet_main_controls.png', 667, 121)
    this.load.spritesheet('settingsButton', './assets/images/UI/SpriteSheet_main_settings.png', 616, 121)
    this.load.spritesheet('exitButton', './assets/images/UI/SpriteSheet_main_exit.png', 358, 121)
    this.load.spritesheet('backButton', './assets/images/UI/SpriteSheet_settings&controls_back.png', 357, 121)
    this.load.image('settingBarBG', './assets/images/UI/controls_music&sound_backbar.png')
    this.load.image('settingBarFG', './assets/images/UI/controls_music&sound_frontbar.png')
    this.load.image('settingBarKnob', './assets/images/UI/controls_music&sound_controlbutton.png')
    this.load.spritesheet('SFXVolume', './assets/images/UI/SpriteSheet_controls_volume.png', 128, 128)
    this.load.spritesheet('MusicNote', './assets/images/UI/SpriteSheet_controls_music.png', 128, 128)
    this.load.image('deathScreen', './assets/images/UI/death_menu.png')
    this.load.image('creditsMenu', './assets/images/UI/menu_credits_board.png')
    this.load.spritesheet('creditsButton', './assets/images/UI/SpriteSheet_main_credits.png', 559, 121)
    this.load.image('controlBoard', 'assets/images/UI/menu_controls_board.png')
    this.load.spritesheet('fullScreen', './assets/images/UI/SpriteSheet_main_fullscreen.png', 70, 63)
    this.load.image('winScreen', './assets/images/UI/win_menu.png')

    // In-game UI
    this.load.image('healthBG', './assets/images/UI/health_back&gold.png')
    this.load.image('healthBar', './assets/images/UI/health_health.png')
    this.load.image('healthFG', './assets/images/UI/health_front.png')
    this.load.spritesheet('enterToPort', './assets/images/UI/SpriteSheet_enterforports.png', 311, 251)

    // Port menus
    this.load.image('icePort', './assets/images/UI/PortMenus/menu_portsnowdon_newport.png')
    this.load.image('startingPort', './assets/images/UI/PortMenus/menu_porttorial_newport.png')
    this.load.image('skullPort', './assets/images/UI/PortMenus/menu_portpyrus_newport.png')
    this.load.image('crecentPort', './assets/images/UI/PortMenus/menu_portsflowen_newport.png')

    // The audiosprite with all music and SFX
    // this.load.audioSprite('sounds', [
    //   'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
    //   'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3'
    // ], 'assets/audio/sounds.json')

    // Load all sounds individually
    this.load.audio('explosion', [
      './assets/audio/explosion.ogg', './assets/audio/explosion.mp3',
      './assets/audio/explosion.m4a', './assets/audio/explosion.ac3'])
    this.load.audio('getHit', [
      './assets/audio/grenade.ogg', './assets/audio/grenade.mp3',
      './assets/audio/grenade.m4a', './assets/audio/grenade.ac3'])
    this.load.audio('deathTune', [
      './assets/audio/pirate1uf.ogg', './assets/audio/pirate1uf.mp3',
      './assets/audio/pirate1uf.m4a', './assets/audio/pirate1uf.ac3'])
    this.load.audio('mainMenuTheme', [
      './assets/audio/Pirate1_Theme1.ogg', './assets/audio/Pirate1_Theme1.mp3',
      './assets/audio/Pirate1_Theme1.m4a', './assets/audio/Pirate1_Theme1.ac3'])
    this.load.audio('mainThemeIntro', [
      './assets/audio/thunderchild-intro.ogg', './assets/audio/thunderchild-intro.mp3',
      './assets/audio/thunderchild-intro.m4a', './assets/audio/thunderchild-intro.ac3'])
    this.load.audio('mainThemeLoop', [
      './assets/audio/thunderchild-loop.ogg', './assets/audio/thunderchild-loop.mp3',
      './assets/audio/thunderchild-loop.m4a', './assets/audio/thunderchild-loop.ac3'])
    this.load.audio('click', [
      './assets/audio/weapswitch.ogg', './assets/audio/weapswitch.mp3',
      './assets/audio/weapswitch.m4a', './assets/audio/weapswitch.ac3'])
    this.load.audio('fireBallShoot', [
      './assets/audio/quaddamage_out.ogg', './assets/audio/quaddamage_out.mp3',
      './assets/audio/quaddamage_out.m4a', './assets/audio/quaddamage_out.ac3'])
    this.load.audio('snakeDeath', [
      './assets/audio/quaddamage_shoot.ogg', './assets/audio/quaddamage_shoot.mp3',
      './assets/audio/quaddamage_shoot.m4a', './assets/audio/quaddamage_shoot.ac3'])
  }

  // Pre-load is done
  create () {
    // Destroy progress bar assets
    this.loaderBar.destroy()
    this.loaderBg.destroy()

    // Re-Start Physics
    this.game.physics.p2 = null
    this.game.physics.startSystem(Phaser.Physics.P2JS)
    this.game.physics.p2.setImpactEvents(true)

    this.game.physics.p2.gravity.y = 700
    this.game.physics.p2.world.defaultContactMaterial.friction = 0.3

    // Setup the audio which should now be loaded
    this.setupAudio()

    this.game.playerGroup = this.game.physics.p2.createCollisionGroup()
    this.game.enemyGroup = this.game.physics.p2.createCollisionGroup()
    this.game.itemGroup = this.game.physics.p2.createCollisionGroup()
    this.game.landGroup = this.game.physics.p2.createCollisionGroup()
    // delet later, game?
    this.game.playerCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.game.cannonballCollisionGroup = this.game.physics.p2.createCollisionGroup()
    this.game.projectileGroup = this.game.physics.p2.createCollisionGroup()
    this.game.portGroup = this.game.physics.p2.createCollisionGroup()
  }

  setupAudio () {
    // // Load the audio sprite into the global game object (and also make a local variable)
    // let sounds = this.game.sounds = this.game.add.audioSprite('sounds')
    // // Make the different music sections flow into one another in a seemless loop
    // // (this is unusually complex and your audio probabaly wont need it)

    // for (let i = 1; i < 4; i++) {
    //   sounds.get(`music-theme${i}`).onStop.add(() => {
    //     sounds.play(`music-theme${i + 1}`, config.MUSIC_VOLUME)
    //   })
    // }

    // sounds.get('music-theme4').onStop.add(() => {
    //   sounds.play('music-bridge', config.MUSIC_VOLUME)
    // })

    // // Theme 2 seems to flow out of the bridge better than theme 1
    // sounds.get('music-bridge').onStop.add(() => {
    //   sounds.play('music-theme2', config.MUSIC_VOLUME)
    // })

    // Add sounds for the game ------------
    this.game.explosion = this.game.add.audio('explosion', config.SFX_VOLUME)
    this.game.fireBallShoot = this.game.add.audio('fireBallShoot', config.SFX_VOLUME)
    this.game.snakeDeath = this.game.add.audio('snakeDeath', config.SFX_VOLUME)
    this.game.getHit = this.game.add.audio('getHit', config.SFX_VOLUME)
    this.game.clickSound = this.game.add.audio('click', config.SFX_VOLUME)
    this.game.mainMenuTheme = this.game.add.audio('mainMenuTheme', config.MUSIC_VOLUME)
    this.game.mainMenuTheme.loop = true
  }

  // Called repeatedly after pre-load finishes and after 'create' has run
  update () {
    if (this.doneWithLogos && this.game.mainMenuTheme.isDecoded) {
      this.state.start('MainMenu')
    }
  }

  startLogoSequence () {
    // Begin the logo process
    let myState = this
    let myCam = this.game.camera
    this.stage.backgroundColor = '#000000'
    myCam.fade(0x000000, 1)
    myCam.onFadeComplete.add(() => {
      myCam.onFadeComplete.removeAll()
      myState.makeSethsBasementLogo()
    })
  }

  makeSethsBasementLogo () {
    // Add the background audio
    this.basementAudio = this.game.add.audio('basement')

    // Add the logo to the screen and center it
    this.sethsBlogo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'sethsBLogo')

    // Setup the text
    this.sethsBText1 = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY - this.sethsBlogo.height / 2 - 50,
      'A game made in')

    this.sethsBText2 = this.game.add.bitmapText(
      this.game.world.centerX,
      this.game.world.centerY + this.sethsBlogo.height / 2 + 50,
      'sethsBFont', 'Seth\'s Basement', 64)

    this.sethsBText3 = this.game.add.text(
      this.game.world.centerX,
      this.game.world.centerY + this.sethsBlogo.height / 2 + 150,
      'by ...')

    // Configure the non-bitmap text
    this.sethsBText1.font = this.sethsBText3.font = 'Arial'
    this.sethsBText1.padding.set(10, 16)
    this.sethsBText3.padding.set(10, 16)
    this.sethsBText1.fontSize = this.sethsBText3.fontSize = 40
    this.sethsBText1.fontWeight = this.sethsBText3.fontWeight = 'bold'
    this.sethsBText1.stroke = this.sethsBText3.stroke = '#000000'
    this.sethsBText1.strokeThickness = this.sethsBText3.strokeThickness = 4
    this.sethsBText1.fill = this.sethsBText3.fill = '#FFFFFF'

    // Center everything
    centerGameObjects([this.sethsBlogo, this.sethsBText1,
      this.sethsBText2, this.sethsBText3])

    // Setup transition fade to happen when audio stops
    let myState = this
    let myCam = this.game.camera
    setTimeout(() => {
      this.basementAudio.fadeOut(1000)
      myCam.fade(0x000000, 1000, false, 1.0)
      myCam.onFadeComplete.add(() => {
        // Reset signal
        myCam.onFadeComplete.removeAll()

        // Remove previous logo
        myState.sethsBlogo.destroy()
        myState.sethsBText1.destroy()
        myState.sethsBText2.destroy()
        myState.sethsBText3.destroy()

        // Create next logo
        myState.makeTeamLogo()
      })
    }, 4000)

    // Fade in from black
    myCam.flash(0x000000, 1000)

    // Start the audio
    this.basementAudio.play()
  }

  makeTeamLogo () {
    // Set final background color
    this.stage.backgroundColor = '#7f7f7f'

    // Add the logo to the screen and center it
    this.logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'logo')

    this.teamName = this.game.add.bitmapText(
      this.game.world.centerX,
      this.game.world.centerY + this.logo.height / 2 + 50,
      'treasureFont', 'Marauder Media', 100)

    centerGameObjects([this.logo, this.teamName])

    // Setup transition fade to happen after timeout
    let myState = this
    let myCam = this.game.camera
    setTimeout(() => {
      myCam.onFadeComplete.add(() => {
        myState.logo.destroy()
        myState.teamName.destroy()
        myCam.onFadeComplete.removeAll()

        myState.showTitle()
      })
      myCam.fade(0x000000, 1000, false, 1.0)
    }, 4000)

    // Fade in from black
    myCam.flash(0x000000, 1000)
  }

  showTitle () {
    // Set final background color
    this.stage.backgroundColor = '#000000'

    // Add the logo to the screen and center it
    this.titleBG = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY, 'titleBG')

    this.gameName = this.game.add.bitmapText(
      this.game.world.centerX, this.game.world.centerY,
      'treasureFont', 'Edge of the Map', 256)

    centerGameObjects([this.titleBG, this.gameName])

    let myState = this
    let myCam = this.game.camera

    // Setup motion
    this.titleBG.scale.setTo(0.33, 0.33)
    this.mapTween = this.game.add.tween(this.titleBG.scale).to(
      { x: 1.0, y: 1.0 }, 4000, Phaser.Easing.Sinusoidal.InOut)

    this.gameName.alpha = 0.0
    this.nameTween = this.game.add.tween(this.gameName).to(
      { alpha: 1.0 }, 4000)

    this.mapTween.onComplete.add(() => {
      myState.nameTween.start()
    })

    // Final fade out after name fade-in finishes
    this.nameTween.onComplete.add(() => {
      setTimeout(() => {
        myCam.fade(0x000000, 1000, false, 1.0)
        myCam.onFadeComplete.add(() => {
          myState.doneWithLogos = true
        })
      }, 2000)
    })

    // Fade in from black
    myCam.flash(0x000000, 1000)
    myState.mapTween.start()
    this.game.mainMenuTheme.play('', 1, config.MUSIC_VOLUME)
  }
}

// Expose the Splash class for use in other modules
export default Splash
