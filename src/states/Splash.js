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
    this.load.spritesheet('Pirat_Ship_1', 'assets/images/Pirat_Ship_1.jpg', 64, 64)
    this.load.spritesheet('player-main', 'assets/images/player-main.png', 64, 64)
    this.load.spritesheet('seasnake', 'assets/images/SpriteSheet_SeaSnake.png', 64, 128)
    this.load.spritesheet('seasnake_attack', './assets/images/SpriteSheet_SeaSnake_Attack_FullBody.png', 64, 128)
    this.load.spritesheet('fireball', './assets/images/SpriteSheet_SeaSnake_Attack_FireBall.png', 16, 32)
    this.load.spritesheet('sharkSheet', './assets/images/SpriteSheet_Shark.png', 32, 48)
    this.load.spritesheet('medBoat', 'assets/images/Player_M_96.png', 96, 96)
    this.load.spritesheet('wake', 'assets/images/spr_wake_8x8.png', 8, 8)
    this.load.spritesheet('mapoverlay', 'assets/images/maptemplatewater.png', 500, 260)
    this.load.spritesheet('cannonball', 'assets/images/Projectiles_75_opacity.png', 32, 32, 4)

    // this.load.image('map', './assets/images/maptemplate.png')

    this.load.image('map', '/assets/images/maptemplate.png')
    /*
    this.load.image('wake1', '/assets/images/spr_wake_1.png')
    this.load.image('wake2', '/assets/images/spr_wake_2.png')
    this.load.image('wake3', '/assets/images/spr_wake_3.png')
    this.load.image('wake4', '/assets/images/spr_wake_4.png')
    */
    // Polygon Testing
    this.load.image('starting_port', '/assets/images/Starting_Port.png')
    this.load.physics('physicsList', 'assets/physicsList.json')

    this.load.image('seasnake_still', '/assets/images/seasnake_16x.png')
    // Enemies
    this.load.image('bluecrab', '/assets/images/crab_blue.png')
    this.load.image('orangecrab', '/assets/images/crab_orange.png')
    this.load.image('jellyfish', '/assets/images/jellyfish_swarm.png')
    this.load.image('kraken', '/assets/images/kraken_wip.png')
    this.load.image('megalodon', '/assets/images/meg_wip.png')
    this.load.image('pirhanas', '/assets/images/piranha_swarm.png')

    // Tilemap Assets
    this.load.tilemap('map1', '/assets/maps/TestingTiledV2.json', null, Phaser.Tilemap.TILED_JSON)
    this.load.image('backgroundImage', '/assets/images/maptemplatewater (1).png')
    this.load.image('islandSprites', '/assets/images/inprogress_map_template_no_back.png')
    this.load.image('cloudBarrier', '/assets/images/cloudedge.png')

    // Menu Assets
    this.load.image('mainMenuBackground', '/assets/images/menu_main_background.png')
    this.load.spritesheet('playButton', '/assets/images/Buttons/SpriteSheet_main_play.png', 358, 121)
    this.load.spritesheet('controlsButton', '/assets/images/Buttons/SpriteSheet_main_controls.png', 667, 121)
    this.load.spritesheet('settingsButton', '/assets/images/Buttons/SpriteSheet_main_settings.png', 616, 121)
    this.load.spritesheet('exitButton', '/assets/images/Buttons/SpriteSheet_main_exit.png', 358, 121)

    // The audiosprite with all music and SFX
    this.load.audioSprite('sounds', [
      'assets/audio/sounds.ogg', 'assets/audio/sounds.mp3',
      'assets/audio/sounds.m4a', 'assets/audio/sounds.ac3'
    ], 'assets/audio/sounds.json')
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
    this.game.projectileGroup = this.game.physics.p2.createCollisionGroup()
  }

  setupAudio () {
    // Load the audio sprite into the global game object (and also make a local variable)
    let sounds = this.game.sounds = this.game.add.audioSprite('sounds')

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
        // this.state.start('TestLevel')
        // this.state.start('PrototypeLevel1')
        // this.state.start('Cam_TestLevel');
        // this.state.start('FiringTest')
      }
    }
  }
}

// Expose the Splash class for use in other modules
export default Splash
