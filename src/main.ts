import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import Game from './scenes/GameScene';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 800 }, debug: true }
  },
  scene: [Preloader, Game]
});
