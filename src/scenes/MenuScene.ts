export default class MenuScene extends Phaser.Scene {
	private startKey!: Phaser.Input.Keyboard.Key;
	private music!: Phaser.Sound.BaseSound;

	constructor() {
		super("Menu");
	}

	create() {
		const { width, height } = this.scale;
		const bg = this.add
			.image(0, 0, "menu_bg")
			.setOrigin(0)
			.setDisplaySize(width, height);
		console.log(bg);

		// Musique
		this.music = this.sound.add("menu_music", {
			volume: 0.2,
			loop: true,
		});
		this.music.play();

		// Overlay sombre
		this.add.rectangle(0, 0, width, height, 0x000000, 0).setOrigin(0);

		// Menu container
		const menuY = height * 0.6;

		// Play button
		const playButton = this.add
			.rectangle(width / 2, menuY, 320, 80, 0x00d4ff, 1)
			.setOrigin(0.5);

		const playText = this.add
			.text(width / 2, menuY, "▶ Commencer", {
				fontSize: "38px",
				fontFamily: "DynaPuff",
				color: "#0a0e27",
				stroke: "#00d4ff",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		// Rendre le bouton interactif
		playButton.setInteractive({ useHandCursor: true });

		// Animations hover
		playButton.on("pointerover", () => {
			this.tweens.add({
				targets: [playButton, playText],
				scale: 1.1,
				duration: 200,
				ease: "Power2",
			});
			playButton.setFillStyle(0x00ffff);
		});

		playButton.on("pointerout", () => {
			this.tweens.add({
				targets: [playButton, playText],
				scale: 1,
				duration: 200,
				ease: "Power2",
			});
			playButton.setFillStyle(0x00d4ff);
		});

		playButton.on("pointerdown", () => this.startGame());

		// Animation d'apparition du bouton
		playButton.setAlpha(0).setY(menuY + 50);
		playText.setAlpha(0).setY(menuY + 50);

		this.tweens.add({
			targets: [playButton, playText],
			alpha: 1,
			y: menuY,
			duration: 800,
			delay: 400,
			ease: "Back.easeOut",
		});

		// Instructions
		const instructions = this.add
			.text(width / 2, height * 0.85, "Appuyez sur ENTRÉE pour commencer", {
				fontSize: "20px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 4,
			})
			.setOrigin(0.5)
			.setAlpha(0.8);

		// Animation clignotante
		this.tweens.add({
			targets: instructions,
			alpha: { from: 0.4, to: 0.9 },
			duration: 1500,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});
		this.createParticles();

		// Press start
		this.startKey = this.input.keyboard.addKey("ENTER");

		// Fade in
		this.cameras.main.fadeIn(800, 0, 0, 0);
	}

	createParticles() {
		const { width, height } = this.scale;

		// Créer des particules flottantes pour l'ambiance
		for (let i = 0; i < 15; i++) {
			const x = Phaser.Math.Between(0, width);
			const y = Phaser.Math.Between(0, height);
			const size = Phaser.Math.Between(2, 6);

			const particle = this.add.circle(x, y, size, 0x00d4ff, 0.3);

			this.tweens.add({
				targets: particle,
				y: y - Phaser.Math.Between(100, 300),
				alpha: { from: 0.3, to: 0 },
				duration: Phaser.Math.Between(3000, 6000),
				delay: Phaser.Math.Between(0, 2000),
				repeat: -1,
				ease: "Sine.easeInOut",
			});
		}
	}

	update() {
		if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
			this.startGame();
		}
	}

	startGame() {
		this.cameras.main.fadeOut(600, 0, 0, 0);
		this.time.delayedCall(600, () => {
			this.scene.start("Game");
			this.music.stop();
		});
	}
}
