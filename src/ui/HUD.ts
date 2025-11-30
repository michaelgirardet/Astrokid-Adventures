import HeartUI from "./HeartUI";
import PlayerIconUI from "./PlayerIconUI";
import ScoreUI from "./ScoreUI";
import StarUI from "./StarUI";

export default class HUD {
	private heartUI: HeartUI;
	private scoreUI: ScoreUI;
	private starUI: StarUI;
	private playerIcon: PlayerIconUI;

	constructor(scene: Phaser.Scene) {
		this.playerIcon = new PlayerIconUI(scene);
		this.heartUI = new HeartUI(scene, 3);
		this.scoreUI = new ScoreUI(scene);
		this.starUI = new StarUI(scene);

		// Position HUD
		const iconX = 60;
		const iconY = 60;

		// Place l’icône du joueur
		this.playerIcon.setPosition(iconX, iconY);

		// Place les cœurs juste à droite de l'icône
		this.heartUI.setPosition(iconX + 80, iconY);

		// Place les étoiles SOUS l'icône et les cœurs
		this.starUI.setPosition(iconX, iconY + 80);
	}

	getHearts() {
		return this.heartUI;
	}

	getScore() {
		return this.scoreUI;
	}

	getStars() {
		return this.starUI;
	}
}
