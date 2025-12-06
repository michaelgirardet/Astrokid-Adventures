import "./global.css";
import CharacterSelectScene from "./scenes/CharacterSelectScene";
import GameScene from "./scenes/GameScene";
import MenuScene from "./scenes/MenuScene";
import PauseScene from "./scenes/PauseScene";
import { Preloader } from "./scenes/Preloader";
import VictoryScene from "./scenes/VictoryScene";

if (window.innerWidth < 768) {
	document.getElementById("mobile-warning").style.display = "block";
} else {
	new Phaser.Game({
		type: Phaser.AUTO,
		width: 1440,
		height: 800,
		pixelArt: true,
		backgroundColor: "#1a1a1a",

		scale: {
			mode: Phaser.Scale.FIT,
			autoCenter: Phaser.Scale.CENTER_BOTH,
			min: { width: 1024, height: 576 },
			max: { width: 1920, height: 1080 },
			fullscreenTarget: "body",
		},

		physics: {
			default: "arcade",
			arcade: { fps: 60, gravity: { y: 650 }, debug: true },
		},

		scene: [
			Preloader,
			CharacterSelectScene,
			GameScene,
			MenuScene,
			PauseScene,
			VictoryScene,
		],
	});
}
