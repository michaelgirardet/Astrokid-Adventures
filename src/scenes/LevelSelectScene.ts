/**
 * Scène de sélection des niveaux.
 *
 * Affiche la liste des niveaux disponibles et permet au joueur
 * de choisir celui à lancer après avoir sélectionné son personnage.
 *
 * @remarks
 * - Les niveaux verrouillés apparaissent grisés et ne sont pas sélectionnables.
 * - Le niveau sélectionné est stocké dans le registry sous la clé `selected_level`.
 * - Cette scène est accessible après la sélection du personnage.
 *
 * @extends Phaser.Scene
 */

import Phaser from "phaser";
import { LEVELS } from "../data/levelData";

export default class LevelSelectScene extends Phaser.Scene {
	constructor() {
		super("LevelSelect");
	}

	/**
	 * Initialise la scène :
	 * - Affichage du fond et du titre
	 * - Génération dynamique des cartes de niveaux
	 * - Gestion des interactions (hover, sélection)
	 * - Gestion du bouton retour vers la sélection de personnage
	 */
	create() {
		const { width, height } = this.scale;

		// Fond
		this.add.rectangle(0, 0, width, height, 0x1a1e42).setOrigin(0);

		// Titre
		this.add
			.text(width / 2, 80, "SELECTION DU NIVEAU", {
				fontSize: "48px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 6,
			})
			.setOrigin(0.5);

		// Calcul du point de départ pour centrer les cartes
		const startX = width / 2 - ((LEVELS.length - 1) * 180) / 2;

		// Création des cartes de niveaux
		LEVELS.forEach((level, index) => {
			const x = startX + index * 180;
			const y = height / 2;

			const card = this.add
				.rectangle(x, y, 160, 120, 0x2e3266)
				.setStrokeStyle(4, 0xffffff)
				.setInteractive({ useHandCursor: !level.locked });

			const label = this.add
				.text(x, y - 10, level.name, {
					fontSize: "20px",
					fontFamily: "DynaPuff",
					color: "#ffffff",
					align: "center",
					wordWrap: { width: 140 },
				})
				.setOrigin(0.5);

			// Niveau verrouillé
			if (level.locked) {
				card.setFillStyle(0x000000, 0.4);
				label.setAlpha(0.4);
				return;
			}

			// Hover → mise en avant visuelle
			card.on("pointerover", () => {
				card.setScale(1.05);
			});

			card.on("pointerout", () => {
				card.setScale(1);
			});

			// Sélection du niveau → lancement du jeu
			card.on("pointerdown", () => {
				this.registry.set("selected_level", level);
				this.scene.start("Game");
			});
		});

		// Bouton retour vers la sélection du personnage
		this.add
			.text(40, 40, "← Retour", {
				fontSize: "28px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
			})
			.setInteractive()
			.on("pointerdown", () => this.scene.start("CharacterSelect"));
	}
}
