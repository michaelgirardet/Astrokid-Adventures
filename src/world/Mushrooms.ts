import { BaseLevel } from "./BaseLevel";

export default class Mushrooms extends BaseLevel {
	private mapKey: string;

	constructor(scene: Phaser.Scene, mapKey = "level_mushrooms") {
		super(scene);
		this.mapKey = mapKey;
	}

	getMapKey(): string {
		return this.mapKey;
	}

	getTileset() {
		return {
			tiles: "Tiles",
			background: "Mushrooms",
		};
	}
}
