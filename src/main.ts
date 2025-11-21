import Phaser from 'phaser';
import Preloader from './scenes/PreLoader';
import Game from './scenes/Game';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { gravity: { y: 500 }, debug: false }
  },
  scene: [Preloader, Game]
});
