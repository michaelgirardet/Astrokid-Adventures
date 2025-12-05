export default class MenuScene extends Phaser.Scene {
	private startKey!: Phaser.Input.Keyboard.Key;
	private music!: Phaser.Sound.BaseSound;
	private isMuted = false;

	constructor() {
		super("Menu");
	}

	create() {
		const { width, height } = this.scale;
		const bg = this.add
			.image(0, 0, "menu_bg")
			.setOrigin(0)
			.setDisplaySize(width, height);

		// Charger depuis local storage
		this.isMuted = localStorage.getItem("soundMuted") === "true";

		this.music = this.sound.add("menu_music", {
			volume: 0.05,
			loop: true,
		});
		this.music.play();

		// Overlay sombre
		this.add.rectangle(0, 0, width, height, 0x446daa, 0.15).setOrigin(0);

		// Menu container
		const menuY = height * 0.6;

		const playButton = this.add
			.rectangle(width / 2, menuY, 320, 80, 0x441151)
			.setOrigin(0.5)
			.setInteractive();

		playButton.on("pointerover", () => {
			playButton.setScale(1.1);
		});
		playButton.on("pointerout", () => {
			playButton.setScale(1);
		});

		playButton.on("pointerover", () => {
			this.tweens.add({
				targets: playButton,
				scale: 1.1,
				duration: 120,
				ease: "Power2",
			});
		});

		playButton.on("pointerout", () => {
			this.tweens.add({
				targets: playButton,
				scale: 1,
				duration: 120,
				ease: "Power2",
			});
		});

		const playText = this.add
			.text(width / 2, menuY, "▶ Commencer", {
				fontSize: "38px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
				stroke: "#ffffff",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		// Bouton son
		const soundButton = this.add
			.image(width - 50, 50, this.isMuted ? "sound_off" : "sound_on")
			.setOrigin(1, 0)
			.setScale(1.25)
			.setInteractive({ useHandCursor: true });

		soundButton.on("pointerdown", () => {
			this.isMuted = !this.isMuted;
			this.sound.mute = this.isMuted;

			// Stocker dans local storage
			localStorage.setItem("soundMuted", this.isMuted.toString());

			soundButton.setTexture(this.isMuted ? "sound_off" : "sound_on");

			if (this.isMuted) this.music.pause();
			else this.music.resume();
		});
		// Etat au lancement
		if (this.isMuted) {
			this.music.pause();
		} else {
			this.music.resume();
		}

		playButton.setInteractive({ useHandCursor: true });

		playButton.on("pointerdown", () => this.startGame());

		const instructions = this.add
			.text(width / 2, height * 0.85, "Appuyez sur ENTRÉE pour commencer", {
				fontSize: "20px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
			})
			.setOrigin(0.5)
			.setAlpha(1);

		this.tweens.add({
			targets: instructions,
			alpha: { from: 0.4, to: 0.9 },
			duration: 1500,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		this.startKey = this.input.keyboard.addKey("ENTER");

		this.cameras.main.fadeIn(800, 0, 0, 0);
	}

	update() {
		if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
			this.startGame();
		}
	}

	startGame() {
		this.cameras.main.fadeOut(600, 0, 0, 0);
		this.time.delayedCall(600, () => {
			this.scene.start("CharacterSelect");
			this.music.stop();
		});
	}
}
