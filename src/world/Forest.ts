import { BaseLevel } from "./BaseLevel";

export default class Forest extends BaseLevel {
	/** Clé Phaser de la map Tiled à charger */
	private mapKey: string;

	constructor(scene: Phaser.Scene, mapKey = "forest_level") {
		super(scene);
		this.mapKey = mapKey;
	}

	getMapKey(): string {
		return this.mapKey;
	}

	getTileset() {
		return {
			tiles: "Tiles",
			background: "Background",
		};
	}
}
