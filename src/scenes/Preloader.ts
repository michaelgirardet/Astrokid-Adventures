import Phaser from 'phaser';

export default class Preloader extends Phaser.Scene {
  constructor() {
    super('Preloader');
  }

  preload() {
    this.load.image('bg', 'assets/background.png');
    this.load.image('ground', 'assets/tiles.png');
    this.load.image('player_idle', 'assets/character_yellow_idle.png');
    this.load.image('player_jump', 'assets/character_yellow_jump.png');
      
    this.load.image('player_walk_a', 'assets/character_yellow_walk_a.png');
    this.load.image('player_walk_b', 'assets/character_yellow_walk_b.png');
      
    this.load.image('enemy_idle', 'assets/enemy_idle.png');
    this.load.image('star', 'assets/star.png');
      
  }

  create() {
    this.scene.start('Game');
  }
}
