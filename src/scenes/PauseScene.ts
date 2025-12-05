import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
	private resumeKey!: Phaser.Input.Keyboard.Key;
	private isMuted = false;

	constructor() {
		super("Pause");
	}

	create() {
		const { width, height } = this.scale;

		this.add
			.rectangle(0, 0, width, height, 0x162028, 0.55) 
			.setOrigin(0);

		this.isMuted = localStorage.getItem("soundMuted") === "true";

		const panel = this.add
			.rectangle(width / 2, height / 2, 520, 520, 0x446daa, 0.92) 
			.setOrigin(0.5)
			.setStrokeStyle(6, 0xadd7f6) 
			.setScale(0.7);

		// appear animation
		this.tweens.add({
			targets: panel,
			scale: 1,
			duration: 400,
			ease: "Back.Out"
		});

		// --- TITLE ---
		this.add
			.text(width / 2, height / 2 - 180, "PAUSE", {
				fontSize: "58px",
				fontFamily: "DynaPuff",
				color: "#446daa", 
				stroke: "#162028",
			})
			.setOrigin(0.5);

		// Buttons
		this.createButton(width / 2, height / 2 - 40, "REPRENDRE", () =>
			this.resumeGame()
		);

		this.createButton(width / 2, height / 2 + 40, "RECOMMENCER", () =>
			this.restartLevel()
		);

		this.createButton(width / 2, height / 2 + 120, "QUITTER", () =>
			this.quitToMenu()
		);

		// Sound Btn
		const soundBtn = this.add
			.image(width - 50, height - 50, this.isMuted ? "sound_off" : "sound_on")
			.setOrigin(1, 1)
			.setScale(1.2)
			.setTint(0xadd7f6) 
			.setInteractive({ useHandCursor: true });

		soundBtn.on("pointerdown", () => {
			this.toggleSound(soundBtn);
		});

		// Keyboard
		this.resumeKey = this.input.keyboard.addKey("ESC");

		this.cameras.main.fadeIn(200, 0, 0, 0);
	}

	// Factory Btn
	createButton(x: number, y: number, label: string, callback: () => void) {
		const width = 320;
		const height = 70;
		const radius = 20;

		// Draw rounded button texture
		const gfx = this.add.graphics();
		gfx.fillStyle(0x441151, 1);
		gfx.fillRoundedRect(0, 0, width, height, radius);
		gfx.generateTexture("pause-btn", width, height);
		gfx.destroy();

		const btn = this.add.image(x, y, "pause-btn").setOrigin(0.5);

		const txt = this.add
			.text(x, y, label, {
				fontFamily: "DynaPuff",
				fontSize: "28px",
				color: "#ffffff", 
				stroke: "#162028",
				strokeThickness: 4
			})
			.setOrigin(0.5);

		btn.setInteractive({ useHandCursor: true });

		btn.on("pointerover", () => {
			btn.setTint(0xadd7f6); // ice
			this.tweens.add({
				targets: [btn, txt],
				scale: 1.07,
				duration: 140,
				ease: "Sine.Out"
			});
		});

		btn.on("pointerout", () => {
			btn.clearTint();
			this.tweens.add({
				targets: [btn, txt],
				scale: 1,
				duration: 140,
				ease: "Sine.Out"
			});
		});

		btn.on("pointerdown", callback);
	}

	// Sound
	toggleSound(btn: Phaser.GameObjects.Image) {
		this.isMuted = !this.isMuted;

		this.sound.mute = this.isMuted;
		localStorage.setItem("soundMuted", this.isMuted.toString());
		btn.setTexture(this.isMuted ? "sound_off" : "sound_on");

		if (this.isMuted) this.game.sound.pauseAll();
		else this.game.sound.resumeAll();
	}

	// Actions
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
