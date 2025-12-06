import type { BaseLevel } from "../world/BaseLevel";
import Forest from "../world/Forest";

export default class LevelLoader {
	private scene: Phaser.Scene;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	load(): BaseLevel {
		const level = new Forest(this.scene);
		level.load();
		return level;
	}
}
