import HeartUI from "./HeartUI";
import ScoreUI from "./ScoreUI";
import StarUI from "./StarUI";

export default class HUD {
	private heartUI: HeartUI;
	private scoreUI: ScoreUI;
	private starUI: StarUI;

	constructor(scene: Phaser.Scene) {
		this.heartUI = new HeartUI(scene, 3);
		this.scoreUI = new ScoreUI(scene);
		this.starUI = new StarUI(scene);
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
