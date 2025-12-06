/**
 * Scène affichée lorsque le joueur termine un niveau avec succès.
 *
 * @description
 * Affiche :
 * - un panneau central animé,
 * - un résumé des performances (score, étoiles, temps),
 * - un bouton renvoyant vers le menu.
 *
 * Les données affichées proviennent du registre Phaser :
 * - `lastScore`
 * - `lastStars`
 * - `lastTime`
 *
 * @remarks
 * Cette scène est lancée depuis GameScene via `scene.start("Victory")`
 * après l'animation de fin de niveau.
 */
export default class VictoryScene extends Phaser.Scene {
	constructor() {
		super("Victory");
	}

	/**
	 * Construit l'écran de victoire :
	 * - fond coloré,
	 * - panneau animé,
	 * - titre,
	 * - statistiques récupérées depuis le registre,
	 * - bouton de retour au menu.
	 */
	create() {
		const { width, height } = this.scale;

		const COLOR_BG = 0x446daa;
		const COLOR_PANEL = 0x446daa;
		const COLOR_TEXT = "#f5f1e8";

		// Fond principal
		this.add.rectangle(0, 0, width, height, COLOR_BG, 1).setOrigin(0);

		// Panneau central
		const panel = this.add
			.rectangle(width / 2, height / 2, 520, 380, COLOR_PANEL, 0.85)
			.setOrigin(0.5)
			.setScale(0.8);

		this.tweens.add({
			targets: panel,
			scale: 1,
			duration: 450,
			ease: "Back.easeOut",
		});

		// Titre
		const title = this.add
			.text(width / 2, height / 2 - 140, "NIVEAU TERMINÉ !", {
				fontSize: "54px",
				fontFamily: "DynaPuff",
				color: COLOR_TEXT,
			})
			.setOrigin(0.5)
			.setAlpha(0);

		this.tweens.add({
			targets: title,
			alpha: 1,
			duration: 800,
			ease: "Power2",
		});

		// Récupération des statistiques du joueur
		const score = this.registry.get("lastScore") ?? 0;
		const stars = this.registry.get("lastStars") ?? 0;
		const time = this.registry.get("lastTime") ?? 0;

		// Texte récapitulatif des stats
		const statsText = this.add
			.text(
				width / 2,
				height / 2 - 20,
				`Score total : ${score}\nÉtoiles récoltées : ${stars}\nTemps : ${time}s`,
				{
					fontSize: "30px",
					fontFamily: "DynaPuff",
					align: "center",
					color: COLOR_TEXT,
				},
			)
			.setOrigin(0.5)
			.setAlpha(0);

		this.tweens.add({
			targets: statsText,
			alpha: 1,
			duration: 600,
			delay: 300,
		});

		// Bouton retour menu
		this.createButton(width / 2, height / 2 + 120, "⏎ MENU", () =>
			this.goToMenu(),
		);

		this.cameras.main.fadeIn(400, 0, 0, 0);
	}

	/**
	 * Fabrique un bouton interactif avec animations.
	 *
	 * @param x - Position X du bouton
	 * @param y - Position Y du bouton
	 * @param label - Texte affiché
	 * @param callback - Fonction exécutée lors du clic
	 */
	createButton(x: number, y: number, label: string, callback: () => void) {
		const COLOR_ACCENT = 0x162028;
		const COLOR_STROKE = "#ffffff";

		const radius = 20;
		const width = 300;
		const height = 70;

		// Texture du bouton
		const gfx = this.add.graphics();
		gfx.fillStyle(COLOR_ACCENT, 1);
		gfx.fillRoundedRect(0, 0, width, height, radius);
		gfx.generateTexture("victory-btn", width, height);
		gfx.destroy();

		const button = this.add.image(x, y, "victory-btn").setOrigin(0.5);

		const text = this.add
			.text(x, y, label, {
				fontSize: "30px",
				fontFamily: "DynaPuff",
				color: COLOR_STROKE,
				stroke: "#ffffff",
				strokeThickness: 2,
			})
			.setOrigin(0.5);

		button.setInteractive({ useHandCursor: true });

		button.on("pointerover", () => {
			this.tweens.add({ targets: [button, text], scale: 1.07, duration: 150 });
		});

		button.on("pointerout", () => {
			this.tweens.add({ targets: [button, text], scale: 1, duration: 150 });
		});

		button.on("pointerdown", () => callback());
	}

	/**
	 * Transition vers le menu principal.
	 * La scène Victory s'efface puis redirige vers MenuScene.
	 */
	goToMenu() {
		this.cameras.main.fadeOut(400, 0, 0, 0);
		this.time.delayedCall(400, () => {
			this.scene.start("Menu");
		});
	}
}
