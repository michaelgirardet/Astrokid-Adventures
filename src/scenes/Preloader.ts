export default class Preloader extends Phaser.Scene {
  constructor() {
    super("Preloader");
  }

  preload() {
    // --- TILESETS (depuis Tiled) ---
    this.load.image("Background", "assets/tiles/background_fade_mushrooms.png");
    this.load.image("Tiles", "assets/tiles/tiles.png");
    this.load.image("Enemies", "assets/tiles/enemies.png");
    this.load.image("Player", "assets/tiles/player.png");

    // --- MAP JSON ---
    this.load.tilemapTiledJSON("level1", "assets/level1.json");

    // --- AUTRES ÉLÉMENTS DU JEU ---
    this.load.image("player_idle", "assets/character_yellow_idle.png");
    this.load.image("player_jump", "assets/character_yellow_jump.png");
    this.load.image("player_walk_a", "assets/character_yellow_walk_a.png");
    this.load.image("player_walk_b", "assets/character_yellow_walk_b.png");

    this.load.image("enemy_idle", "assets/enemy_idle.png");

    this.load.image("Ground", "assets/ground.png");
    this.load.image("Block", "assets/block.png");
    this.load.image("Star", "assets/star.png");
    this.load.image("Coin", "assets/star.png");
  }

  create() {
    this.scene.start("Game");
  }
}
