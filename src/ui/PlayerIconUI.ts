export default class PlayerIconUI {
	public icon: Phaser.GameObjects.Image;

	constructor(scene: Phaser.Scene) {
		this.icon = scene.add.image(64, 64, "player_icon");
		this.icon.setScale(0.8);
		this.icon.setScrollFactor(0);
		this.icon.setDepth(1000);
	}

	setPosition(x: number, y: number) {
		this.icon.setPosition(x, y);
	}

	getWidth() {
		return this.icon.displayWidth;
	}
}
