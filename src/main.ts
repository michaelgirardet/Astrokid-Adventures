import Phaser from 'phaser';
import Preloader from './scenes/Preloader';
import Game from './scenes/GameScene';
import MenuScene from './scenes/MenuScene';
import PauseScene from './scenes/PauseScene';
import VictoryScene from './scenes/VictoryScene';

new Phaser.Game({
  type: Phaser.AUTO,
  width: 1440,
  height: 800,
  pixelArt: true,
  physics: {
    default: 'arcade',
    arcade: { fps: 60, gravity: { y: 800 }, debug: false }
  },
  scene: [Preloader, Game, MenuScene, PauseScene, VictoryScene]
});
