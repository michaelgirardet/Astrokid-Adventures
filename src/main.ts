import GameScene from "./scenes/GameScene";
import MenuScene from "./scenes/MenuScene";
import PauseScene from "./scenes/PauseScene";
import { Preloader } from "./scenes/Preloader";
import VictoryScene from "./scenes/VictoryScene";

new Phaser.Game({
	type: Phaser.AUTO,
	width: 1440,
	height: 800,
	pixelArt: true,

	scale: {
		mode: Phaser.Scale.FIT, // s'adapte automatiquement
		autoCenter: Phaser.Scale.CENTER_BOTH, // centre le jeu
		min: {
			width: 1024,
			height: 576,
		},
		max: {
			width: 1920,
			height: 1080,
		},
		fullscreenTarget: "body",
	},

	physics: {
		default: "arcade",
		arcade: { fps: 60, gravity: { y: 600 }, debug: false },
	},

	scene: [Preloader, GameScene, MenuScene, PauseScene, VictoryScene],
});
