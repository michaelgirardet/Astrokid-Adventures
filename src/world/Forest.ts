import { BaseLevel } from "./BaseLevel";

export default class Forest extends BaseLevel {
	getMapKey() {
		return "forest_level";
	}

	getTileset() {
		return {
			tiles: "Tiles",
			background: "Background",
		};
	}
}
