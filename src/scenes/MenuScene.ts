/**
 * Scene du menu principal du jeu.
 *
 * Gère :
 * - l'affichage du fond et du panneau principal
 * - le bouton pour démarrer la partie
 * - le bouton de gestion du son (mute / unmute)
 * - la musique du menu
 * - la transition vers la scène de sélection des personnages
 *
 * @extends Phaser.Scene
 */

export default class MenuScene extends Phaser.Scene {
	/** Touche permettant de démarrer le jeu (ENTER). */
	private startKey!: Phaser.Input.Keyboard.Key;

	/** Musique du menu (boucle à faible volume). */
	private music!: Phaser.Sound.BaseSound;

	/** État du son (muté ou non), stocké dans localStorage. */
	private isMuted = false;

	constructor() {
		super("Menu");
	}

	/**
	 * Initialise et affiche le menu.
	 *
	 * - Charge la préférence utilisateur (mute)
	 * - Lance la musique
	 * - Crée le bouton "Commencer"
	 * - Crée le bouton sonore
	 * - Ajoute un message invitant à appuyer sur Entrée
	 * - Met en place un fondu d'entrée de la caméra
	 */
	create() {
		const { width, height } = this.scale;

		this.add.image(0, 0, "menu_bg").setOrigin(0).setDisplaySize(width, height);

		this.isMuted = localStorage.getItem("soundMuted") === "true";

		this.music = this.sound.add("menu_music", { volume: 0.05, loop: true });
		this.music.play();
		if (this.isMuted) this.music.pause();

		this.add.rectangle(0, 0, width, height, 0x446daa, 0.15).setOrigin(0);

		const menuY = height * 0.6;

		const playButton = this.add
			.rectangle(width / 2, menuY, 320, 80, 0x6ec7f7)
			.setOrigin(0.5)
			.setInteractive({ useHandCursor: true });

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

		playButton.on("pointerdown", () => this.startGame());

		this.add
			.text(width / 2, menuY, "▶ Commencer", {
				fontSize: "38px",
				fontFamily: "DynaPuff",
				color: "#162028",
			})
			.setOrigin(0.5);

		const soundButton = this.add
			.image(width - 50, 50, this.isMuted ? "sound_off" : "sound_on")
			.setOrigin(1, 0)
			.setScale(1.25)
			.setInteractive({ useHandCursor: true });

		soundButton.on("pointerdown", () => {
			this.isMuted = !this.isMuted;
			this.sound.mute = this.isMuted;

			localStorage.setItem("soundMuted", this.isMuted.toString());
			soundButton.setTexture(this.isMuted ? "sound_off" : "sound_on");

			if (this.isMuted) this.music.pause();
			else this.music.resume();
		});

		const instructions = this.add
			.text(width / 2, height * 0.85, "Appuyez sur ENTRÉE pour commencer", {
				fontSize: "20px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
			})
			.setOrigin(0.5);

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

	/**
	 * Boucle frame-par-frame du menu.
	 * Détecte la pression de la touche ENTER pour lancer le jeu.
	 */
	update() {
		if (Phaser.Input.Keyboard.JustDown(this.startKey)) {
			this.startGame();
		}
	}

	/**
	 * Transition vers l'écran de sélection du personnage.
	 * Effet de fondu + arrêt de la musique.
	 */
	startGame() {
		this.cameras.main.fadeOut(600, 0, 0, 0);

		this.time.delayedCall(600, () => {
			this.music.stop();
			this.scene.start("CharacterSelect");
		});
	}
}
