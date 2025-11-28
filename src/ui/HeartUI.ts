export default class HeartUI {
	private scene: Phaser.Scene;
	private hearts: Phaser.GameObjects.Image[] = [];
	private maxHearts: number;
	private currentHearts: number;

	constructor(scene: Phaser.Scene, maxHearts: number) {
		this.scene = scene;
		this.maxHearts = maxHearts;
		this.currentHearts = maxHearts;

		this.createHearts();
	}

	createHearts() {
		const startX = 20;
		const startY = 20;

		for (let i = 0; i < this.maxHearts; i++) {
			const heart = this.scene.add.image(startX + i * 48, startY, "heart_full");
			heart.setScrollFactor(0);
			heart.setDepth(1000);
			this.hearts.push(heart);
		}
	}

	setHearts(value: number) {
		this.currentHearts = value;

		for (let i = 0; i < this.maxHearts; i++) {
			this.hearts[i].setTexture(i < value ? "heart_full" : "heart_empty");
		}
	}

	loseHeart() {
		this.setHearts(this.currentHearts - 1);
	}

	getHearts() {
		return this.currentHearts;
	}
}
