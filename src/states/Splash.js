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

    // Add the logo to the screen and center it
    this.logo = this.game.add.sprite(
      this.game.world.centerX, this.game.world.centerY + 100, 'ourLogo')
    centerGameObjects([this.logo])
  }

  preload () {
    // Create sprites from the progress bar assets
    this.loaderBg = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBg')
    this.loaderBar = this.add.sprite(
      this.game.world.centerX, this.game.height - 30, 'loaderBar')
    centerGameObjects([this.loaderBg, this.loaderBar])

    // Display the progress bar
    this.load.setPreloadSprite(this.loaderBar)

    // Load all the assets needed for next state

    // The main player spritesheet
    // this.load.spritesheet('Pirat_Ship_1', 'assets/images/Player/Pirat_Ship_1.jpg', 64, 64)
    // this.load.spritesheet('player-main', 'assets/images/Player/player-main.png', 64, 64)
    this.load.spritesheet('player-med', '/assets/images/PLayer_M_Ship_96x96/Player_M_96_Sprite_Sheet.png', 96, 96)

    this.load.spritesheet('seasnake', 'assets/images/Enemies/SpriteSheet_SeaSnake.png', 64, 128)
    this.load.spritesheet('seasnake_attack', './assets/images/Enemies/SpriteSheet_SeaSnake_Attack_FullBody.png', 64, 128)
    this.load.spritesheet('fireball', './assets/images/Enemies/SpriteSheet_SeaSnake_Attack_FireBall.png', 16, 32)
    this.load.spritesheet('sharkSheet', './assets/images/Enemies/SpriteSheet_Shark.png', 32, 48)
    // this.load.spritesheet('medBoat', 'assets/images/Player/Player_M_96.png', 96, 96)
    // this.load.spritesheet('wake', 'assets/images/Player/spr_wake_8x8.png', 8, 8)
    // this.load.spritesheet('mapoverlay', 'assets/images/Terrain/maptemplatewater.png', 500, 260)
    this.load.spritesheet('cannonball', 'assets/images/Player/Projectiles_75_opacity.png', 32, 32, 4)
    this.load.spritesheet('seasnake_final', 'assets/images/Enemies/SpriteSheet_SeaSnake_BothFull.png', 64, 160)
    this.load.spritesheet('enemyship', 'assets/images/Enemies/Enemy_Ships_L_128.png', 128, 128)

    // this.load.image('map', '/assets/images/Terrain/maptemplate.png')
    /*
    this.load.image('wake1', '/assets/images/spr_wake_1.png')
    this.load.image('wake2', '/assets/images/spr_wake_2.png')
    this.load.image('wake3', '/assets/images/spr_wake_3.png')
    this.load.image('wake4', '/assets/images/spr_wake_4.png')
    */
    // Polygon Testing
    // this.load.image('starting_port', '/assets/images/Terrain/Starting_Port.png')
    // this.load.physics('physicsList', 'assets/physicsList.json')

    // Tiled Physics
    this.load.physics('GameObjects', '/assets/maps/TestingTiledV2.json')
    // this.load.physics('WallObjects', '/assets/maps/TestingTiledV2.json')

    this.load.image('seasnake_still', '/assets/images/Enemies/seasnake_16x.png')
    // Enemies
    this.load.image('bluecrab', '/assets/images/Enemies/crab_blue.png')
    this.load.image('orangecrab', '/assets/images/Enemies/crab_orange.png')
    this.load.image('jellyfish', '/assets/images/Enemies/jellyfish_swarm.png')
    this.load.image('kraken', '/assets/images/Enemies/kraken_wip.png')
    this.load.image('megalodon', '/assets/images/Enemies/meg_wip.png')
    this.load.image('pirhanas', '/assets/images/Enemies/piranha_swarm.png')

    // Tilemap Assets
    this.load.tilemap('map1', '/assets/maps/TestingTiledV2.json', null, Phaser.Tilemap.TILED_JSON) // it needs this
    this.load.image('FinalMap', '/assets/images/Terrain/Map_With_Border.png')
    this.load.image('backgroundImage', '/assets/images/Terrain/maptemplatewater (1).png')
    this.load.image('islandSprites', '/assets/images/Terrain/inprogress_map_template_no_back.png')
    this.load.image('cloudBarrier', '/assets/images/Terrain/cloudedge.png')
    this.load.image('comboMap', '/assets/images/Terrain/mapCombo.png')
    this.load.image('nothing', '/assets/images/Terrain/spr_nothing.png')

    // Menu Assets
    this.load.image('mainMenuBackground', '/assets/images/Ui/menu_main_background.png')
    this.load.image('settingsMenuBoard', '/assets/images/Ui/menu_main_board.png')
    this.load.spritesheet('playButton', '/assets/images/Ui/SpriteSheet_main_play.png', 358, 121)
    this.load.spritesheet('controlsButton', '/assets/images/Ui/SpriteSheet_main_controls.png', 667, 121)
    this.load.spritesheet('settingsButton', '/assets/images/Ui/SpriteSheet_main_settings.png', 616, 121)
    this.load.spritesheet('exitButton', '/assets/images/Ui/SpriteSheet_main_exit.png', 358, 121)
    this.load.spritesheet('backButton', '/assets/images/Ui/SpriteSheet_settings&controls_back.png', 357, 121)
    this.load.image('settingBarBG', '/assets/images/Ui/controls_music&sound_backbar.png')
    this.load.image('settingBarFG', '/assets/images/Ui/controls_music&sound_frontbar.png')
    this.load.image('settingBarKnob', '/assets/images/Ui/controls_music&sound_controlbutton.png')
    this.load.spritesheet('SFXVolume', '/assets/images/Ui/SpriteSheet_controls_volume.png', 128, 128)
    this.load.image('deathScreen', '/assets/images/UI/death_menu.png')


    // In-game UI
    this.load.image('healthBG', '/assets/images/UI/health_back&gold.png')
    this.load.image('healthBar', '/assets/images/UI/health_health.png')
    this.load.image('healthFG', '/assets/images/UI/health_front.png')

    this.load.image('controlBoard', 'assets/images/Ui/menu_controls_board.png')
    // The audiosprite with all music and SFX
    this.load.audioSprite('sounds', [
      'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
      'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3', 
      'assets/audio/SFX//q009/explosion.ogg', 'assets/audio/SFX//q009/grenade.ogg'
    ], 'assets/audio/sounds.json')
    this.load.audio('explosion', 'assets/audio/SFX//q009/explosion.ogg')
    this.load.audio('getHit', 'assets/audio/SFX//q009/grenade.ogg')

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
  }

  setupAudio () {
    // Load the audio sprite into the global game object (and also make a local variable)
    let sounds = this.game.sounds = this.game.add.audioSprite('sounds')
    this.game.explosion = this.game.add.audio('explosion', config.SFX_VOLUME)
    this.game.getHit = this.game.add.audio('getHit', config.SFX_VOLUME)
    // Make the different music sections flow into one another in a seemless loop
    // (this is unusually complex and your audio probabaly wont need it)
    sounds.get('music-intro').onStop.add(() => {
      sounds.play('music-theme1', config.MUSIC_VOLUME)
    })

    for (let i = 1; i < 4; i++) {
      sounds.get(`music-theme${i}`).onStop.add(() => {
        sounds.play(`music-theme${i + 1}`, config.MUSIC_VOLUME)
      })
    }

    sounds.get('music-theme4').onStop.add(() => {
      sounds.play('music-bridge', config.MUSIC_VOLUME)
    })

    // Theme 2 seems to flow out of the bridge better than theme 1
    sounds.get('music-bridge').onStop.add(() => {
      sounds.play('music-theme2', config.MUSIC_VOLUME)
    })
  }

  // Called repeatedly after pre-load finishes and after 'create' has run
  update () {
    // Check how much time has elapsed since the stage started and only
    // proceed once MIN_SPLASH_SECONDS or more has elapsed
    if (this.game.time.elapsedSecondsSince(this.started) >= config.MIN_SPLASH_SECONDS) {
      // Make sure the audio is not only loaded but also decoded before advancing
      if (this.game.sounds.get('music-intro').isDecoded) {
        this.state.start('MainMenu')
      }
    }
  }
}

// Expose the Splash class for use in other modules
export default Splash
