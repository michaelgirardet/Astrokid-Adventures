import { createAnimations } from "../core/PreloaderAnimations";
import { loadAssets } from "../core/PreloaderAssets";

export class Preloader extends Phaser.Scene {
	constructor() {
		super("Preloader");
	}

	preload() {
		loadAssets(this);
	}

	create() {
		createAnimations(this);
		this.scene.start("Menu");
	}
}
