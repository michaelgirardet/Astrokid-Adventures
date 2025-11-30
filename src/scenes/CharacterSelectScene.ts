export default class CharacterSelectScene extends Phaser.Scene {
	constructor() {
		super("CharacterSelect");
	}

	create() {
		// Titre
		this.add
			.text(400, 80, "Sélection du personnage", {
				fontSize: "32px",
				color: "#fff",
			})
			.setOrigin(0.5);

		// Exemple : 1 seul personnage pour l'instant
		const astro = this.add
			.image(400, 250, "player_icon")
			.setScale(2)
			.setInteractive({ useHandCursor: true });

		astro.on("pointerdown", () => {
			// Enregistrer le personnage sélectionné
			this.registry.set("selected_character", "yellow");

			// Lancer la GameScene
			this.scene.start("Game");
		});

		// Bouton retour
		const back = this.add
			.text(40, 40, "← Retour", {
				fontSize: "20px",
				color: "#fff",
			})
			.setInteractive();

		back.on("pointerdown", () => {
			this.scene.start("Menu");
		});
	}
}
