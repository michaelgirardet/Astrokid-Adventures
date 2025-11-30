import HeartUI from "./HeartUI";
import HintUI from "./HintUI";
import PlayerIconUI from "./PlayerIconUI";
import ScoreUI from "./ScoreUI";
import StarUI from "./StarUI";

export default class HUD {
	private heartUI: HeartUI;
	private scoreUI: ScoreUI;
	private starUI: StarUI;
	private playerIcon: PlayerIconUI;
	private hint: HintUI;

	constructor(scene: Phaser.Scene) {
		this.playerIcon = new PlayerIconUI(scene);
		this.heartUI = new HeartUI(scene, 3);
		this.scoreUI = new ScoreUI(scene);
		this.starUI = new StarUI(scene);
		this.hint = new HintUI(scene);

		const iconX = 60;
		const iconY = 60;

		this.playerIcon.setPosition(iconX, iconY);
		this.heartUI.setPosition(iconX + 80, iconY);
		this.starUI.setPosition(iconX, iconY + 80);
	}

	getHint() {
		return this.hint;
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
