import HUD from "../ui/HUD";
import type HeartUI from "../ui/HeartUI";
import type ScoreUI from "../ui/ScoreUI";
import type StarUI from "../ui/StarUI";

export default class UIManager {
	private hud: HUD;

	constructor(scene: Phaser.Scene) {
		this.hud = new HUD(scene);
	}

	get hearts(): HeartUI {
		return this.hud.getHearts();
	}

	get score(): ScoreUI {
		return this.hud.getScore();
	}

	get stars(): StarUI {
		return this.hud.getStars();
	}

	get hint() {
		return this.hud.getHint();
	}
}
