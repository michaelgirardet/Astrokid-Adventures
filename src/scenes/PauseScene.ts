/**
 * Scène d'arrêt temporaire du jeu ("Pause").
 *
 * @description
 * Cette scène s'affiche lorsque le joueur presse ESC depuis GameScene.
 * Elle suspend la logique de jeu et présente :
 * - un panneau central,
 * - des boutons pour reprendre, recommencer ou quitter,
 * - un contrôle du son (mute/unmute).
 *
 * @remarks
 * La scène sous-jacente ("Game") est mise en pause via `scene.pause()`
 * et reprend via `scene.resume()`.
 */
import Phaser from "phaser";

export default class PauseScene extends Phaser.Scene {
	/** Touche permettant de fermer la pause par clavier (ESC). */
	private resumeKey!: Phaser.Input.Keyboard.Key;

	/** Indique si le son global du jeu est coupé. */
	private isMuted = false;

	constructor() {
		super("Pause");
	}

	/**
	 * Construit l'overlay de pause :
	 * - fond semi-transparent,
	 * - panneau animé,
	 * - 3 boutons d'action,
	 * - bouton de gestion du son,
	 * - écoute de la touche ESC.
	 */
	create() {
		const { width, height } = this.scale;

		this.add.rectangle(0, 0, width, height, 0x162028, 0.55).setOrigin(0);

		this.isMuted = localStorage.getItem("soundMuted") === "true";

		const panel = this.add
			.rectangle(width / 2, height / 2, 520, 520, 0x1a1e42, 0.92)
			.setOrigin(0.5)
			.setStrokeStyle(6, 0x6ec7f7)
			.setScale(0.7);

		// Animation d’apparition
		this.tweens.add({
			targets: panel,
			scale: 1,
			duration: 400,
			ease: "Back.Out",
		});

		this.add
			.text(width / 2, height / 2 - 180, "PAUSE", {
				fontSize: "58px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
			})
			.setOrigin(0.5);

		// Boutons
		this.createButton(width / 2, height / 2 - 40, "REPRENDRE", () =>
			this.resumeGame(),
		);

		this.createButton(width / 2, height / 2 + 40, "RECOMMENCER", () =>
			this.restartLevel(),
		);

		this.createButton(width / 2, height / 2 + 120, "QUITTER", () =>
			this.quitToMenu(),
		);

		// Bouton Son
		const soundBtn = this.add
			.image(width - 50, height - 50, this.isMuted ? "sound_off" : "sound_on")
			.setOrigin(1, 1)
			.setScale(1.2)
			.setTint(0xadd7f6)
			.setInteractive({ useHandCursor: true });

		soundBtn.on("pointerdown", () => {
			this.toggleSound(soundBtn);
		});

		this.resumeKey = this.input.keyboard.addKey("ESC");

		this.cameras.main.fadeIn(200, 0, 0, 0);
	}

	/**
	 * Crée un bouton interactif avec animation de survol.
	 *
	 * @param x - Position X du bouton
	 * @param y - Position Y du bouton
	 * @param label - Texte affiché
	 * @param callback - Fonction exécutée lors du clic
	 */
	createButton(x: number, y: number, label: string, callback: () => void) {
		const width = 320;
		const height = 70;
		const radius = 20;

		// Texture du bouton (carré arrondi)
		const gfx = this.add.graphics();
		gfx.fillStyle(0x6ec7f7, 1);
		gfx.fillRoundedRect(0, 0, width, height, radius);
		gfx.generateTexture("pause-btn", width, height);
		gfx.destroy();

		const btn = this.add.image(x, y, "pause-btn").setOrigin(0.5);

		const txt = this.add
			.text(x, y, label, {
				fontFamily: "DynaPuff",
				fontSize: "24px",
				color: "#162028",
			})
			.setOrigin(0.5);

		btn.setInteractive({ useHandCursor: true });

		btn.on("pointerover", () => {
			btn.setTint(0xadd7f6);
			this.tweens.add({
				targets: [btn, txt],
				scale: 1.07,
				duration: 140,
				ease: "Sine.Out",
			});
		});

		btn.on("pointerout", () => {
			btn.clearTint();
			this.tweens.add({
				targets: [btn, txt],
				scale: 1,
				duration: 140,
				ease: "Sine.Out",
			});
		});

		btn.on("pointerdown", callback);
	}

	/**
	 * Active ou désactive le son global du jeu.
	 *
	 * @param btn - Le bouton dont l'icône doit être mise à jour.
	 */
	toggleSound(btn: Phaser.GameObjects.Image) {
		this.isMuted = !this.isMuted;

		this.sound.mute = this.isMuted;
		localStorage.setItem("soundMuted", this.isMuted.toString());

		btn.setTexture(this.isMuted ? "sound_off" : "sound_on");

		if (this.isMuted) this.game.sound.pauseAll();
		else this.game.sound.resumeAll();
	}

	/**
	 * Ferme la scène Pause et reprend GameScene.
	 */
	resumeGame() {
		this.cameras.main.fadeOut(200);
		this.time.delayedCall(200, () => {
			this.scene.stop();
			this.scene.resume("Game");
		});
	}

	/**
	 * Redémarre complètement le niveau.
	 * Arrête la musique du GameScene pour éviter tout doublon.
	 */
	restartLevel() {
		this.scene.stop("Game");
		this.scene.start("Game");
		this.scene.stop();

		const gameScene = this.scene.get("Game");
		if (gameScene?.sound) {
			gameScene.sound.stopAll();
		}
	}

	/**
	 * Quitte vers le menu principal.
	 * Le GameScene est stoppé ainsi que tous les sons.
	 */
	quitToMenu() {
		this.scene.stop("Game");
		this.scene.start("Menu");
		this.scene.stop();
		this.isMuted = true;

		const gameScene = this.scene.get("Game");
		if (gameScene?.sound) {
			gameScene.sound.stopAll();
		}
	}

	/**
	 * Vérifie si ESC est pressé pour fermer rapidement la pause.
	 */
	update() {
		if (Phaser.Input.Keyboard.JustDown(this.resumeKey)) {
			this.resumeGame();
		}
	}
}
