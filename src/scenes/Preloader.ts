export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    this.load.image("Background", "assets/tiles/background_fade_mushrooms.png");
    this.load.image("Tiles", "assets/tiles/tiles.png");
    this.load.image("Enemies", "assets/tiles/enemies.png");
    this.load.image("Player", "assets/tiles/player.png");

    this.load.tilemapTiledJSON("level1", "assets/level1.json");

    this.load.image("player_idle", "assets/player/character_pink_idle.png");
    this.load.image("player_jump", "assets/player/character_pink_jump.png");
    this.load.image("player_walk_a", "assets/player/character_pink_walk_a.png");
    this.load.image("player_walk_b", "assets/player/character_pink_walk_b.png");

    // this.load.image("enemy_idle", "assets/enemy_idle.png");

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

      // Démarrer le jeu
      this.scene.start("Game");
    }
  }
