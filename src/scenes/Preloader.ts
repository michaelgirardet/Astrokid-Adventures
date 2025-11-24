export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("Background", "assets/tiles/background_fade_mushrooms.webp");
    this.load.image("Tiles", "assets/tiles/tiles.webp");
    this.load.image("Enemies", "assets/tiles/enemies.webp");
    this.load.image("Player", "assets/tiles/player.webp");

    this.load.tilemapTiledJSON("level1", "assets/level1.json");
    this.load.image("menu_bg", "assets/ui/background_echo_jump.png");

    this.load.audio("menu_music", "assets/sounds/music/menu.mp3");
    this.load.audio("game_music", "assets/sounds/music/level1.mp3");

    this.load.image("heart_full", "assets/ui/heart_full.png");
    this.load.image("heart_empty", "assets/ui/heart_empty.png");

    this.load.image("player_idle", "assets/player/character_pink_idle.webp");
    this.load.image("player_jump", "assets/player/character_pink_jump.webp");
    this.load.image("player_walk_a", "assets/player/character_pink_walk_a.png");
    this.load.image("player_walk_b", "assets/player/character_pink_walk_b.png");

    this.load.image("enemy_idle", "assets/enemy_idle.png");
    this.load.image("blob_idle", "assets/enemies/blob/slime_normal_rest.png");
    this.load.image("blob_walk_a", "assets/enemies/blob/slime_normal_walk_a.png");
    this.load.image("blob_walk_b", "assets/enemies/blob/slime_normal_walk_b.png");

    this.load.image("Ground", "assets/ground.png");
    this.load.image("Block", "assets/block.png");
    this.load.image("Coin", "assets/coin.png");
    this.load.image("Star", "assets/items/star.png");
  }

    create() {


      
      // --- PLAYER IDLE ---
      this.anims.create({
        key: "player-idle",
        frames: [{ key: "player_idle" }],
        frameRate: 1,
        repeat: -1
      });

      // --- PLAYER WALKING ---
      this.anims.create({
        key: "player-walk",
        frames: [
          { key: "player_walk_a" },
          { key: "player_walk_b" }
        ],
        frameRate: 8,
      });

      // --- PLAYER JUMP ---
      this.anims.create({
        key: "player-jump",
        frames: [{ key: "player_jump" }],
        frameRate: 1,
        repeat: -1
      });

      // --- ENEMY ---
      this.anims.create({
        key: "enemy-idle",
        frames: [{ key: "enemy_idle" }],
        frameRate: 1,
        repeat: -1
      });

      this.anims.create({
        key: "blob-walk",
        frames: [
          { key: "blob_walk_a" },
          { key: "blob_walk_b" }
        ],
        frameRate: 4,
        repeat: -1
      });

      // Démarrer le jeu
      this.scene.start("Menu");
    }
  }
