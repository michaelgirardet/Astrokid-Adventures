export default class PauseScene extends Phaser.Scene {
	private resumeKey!: Phaser.Input.Keyboard.Key;

	constructor() {
		super("Pause");
	}

	create() {
		const { width, height } = this.scale;
		this.add.rectangle(0, 0, width, height, 0x000000, 0.55).setOrigin(0);

		// Menu
		const panel = this.add
			.rectangle(width / 2, height / 2, 450, 450, 0x1a1a2e, 0.75)
			.setOrigin(0.5)
			.setStrokeStyle(4, 0x00d4ff)
			.setScale(0.85);

		this.tweens.add({
			targets: panel,
			scale: 1,
			duration: 350,
			ease: "Back.easeOut",
		});

		// Title
		this.add
			.text(width / 2, height / 2 - 115, "PAUSE", {
				fontSize: "54px",
				fontFamily: "DynaPuff",
				color: "#00d4ff",
				stroke: "#0a0e27",
				strokeThickness: 8,
			})
			.setOrigin(0.5);

		// Buttons
		this.createRoundedButton(width / 2, height / 2 - 20, "REPRENDRE", () =>
			this.resumeGame(),
		);

		this.createRoundedButton(width / 2, height / 2 + 60, "RECOMMENCER", () =>
			this.restartLevel(),
		);

		this.createRoundedButton(width / 2, height / 2 + 140, "QUITTER", () =>
			this.quitToMenu(),
		);

		// --- Keybind Resume ---
		this.resumeKey = this.input.keyboard.addKey("ESC");

		this.cameras.main.fadeIn(200, 0, 0, 0);
	}

	// Buttons
	createRoundedButton(x: number, y: number, label: string, callback: Function) {
		const radius = 18;
		const width = 300;
		const height = 60;

		const graphics = this.add.graphics();
		graphics.fillStyle(0x00d4ff, 1);
		graphics.fillRoundedRect(0, 0, width, height, radius);
		graphics.generateTexture("rounded-btn", width, height);
		graphics.destroy();

		// --- Sprite bouton ---
		const button = this.add.image(x, y, "rounded-btn").setOrigin(0.5);

		// --- Texte ---
		const text = this.add
			.text(x, y, label, {
				fontSize: "26px",
				fontFamily: "DynaPuff",
				color: "#0a0e27",
				stroke: "#00eaff",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		// --- Interaction ---
		button.setInteractive({ useHandCursor: true });

		button.on("pointerover", () => {
			this.tweens.add({
				targets: [button, text],
				scale: 1.06,
				duration: 150,
			});
			button.setTint(0x00f6ff);
		});

		button.on("pointerout", () => {
			this.tweens.add({
				targets: [button, text],
				scale: 1,
				duration: 150,
			});
			button.clearTint();
		});

		button.on("pointerdown", () => callback());
	}

	resumeGame() {
		this.cameras.main.fadeOut(200);
		this.time.delayedCall(200, () => {
			this.scene.stop();
			this.scene.resume("Game");
		});
	}

	restartLevel() {
		this.scene.stop("Game");
		this.scene.start("Game");
	}

	quitToMenu() {
		this.scene.stop("Game");
		this.scene.start("Menu");
	}

	update() {
		if (Phaser.Input.Keyboard.JustDown(this.resumeKey)) {
			this.resumeGame();
		}
	}
}
