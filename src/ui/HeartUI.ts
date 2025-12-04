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
		const startX = 80; // déplacé pour laisser la place à l'icône du joueur
		const startY = 40;

		for (let i = 0; i < this.maxHearts; i++) {
			const heart = this.scene.add.image(startX + i * 48, startY, "heart_full");
			heart.setScrollFactor(0);
			heart.setDepth(1000);
			this.hearts.push(heart);
		}
	}

	/** Permet au HUD de repositionner tous les cœurs */
	setPosition(x: number, y: number) {
		this.hearts.forEach((heart, i) => {
			heart.setPosition(x + i * 48, y);
		});
	}

	/** Remplace plein ↔ vide */
	setHearts(value: number) {
		this.currentHearts = value;

		for (let i = 0; i < this.maxHearts; i++) {
			this.hearts[i].setTexture(i < value ? "heart_full" : "heart_empty");
		}
	}

	/** Baisse la vie d’un cœur */
	loseHeart() {
		this.setHearts(this.currentHearts - 1);
	}

	getHearts() {
		return this.currentHearts;
	}
}
