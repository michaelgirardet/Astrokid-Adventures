import Phaser from 'phaser';

let platforms;

export default class Game extends Phaser.Scene {
    player!: Phaser.Physics.Arcade.Sprite;
    cursors: any;
    

  constructor() {
    super('Game');
  }

  create() {
      const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
      bg.setDisplaySize(this.scale.width, this.scale.height);
  }

  update() {
  }
}
