/**
 * Scène de sélection des personnages.
 *
 * Affiche les différentes options jouables, leurs stats détaillées
 * (via CharacterInfoCard) et permet au joueur de choisir son avatar
 * avant le lancement du niveau.
 *
 * @remarks
 * - Les personnages non disponibles apparaissent en grisé.
 * - Le panneau latéral affiche les statistiques du personnage survolé.
 * - Le choix est stocké dans le registry sous la clé `selected_character`.
 *
 * @extends Phaser.Scene
 */

import Phaser from "phaser";
import { CHARACTER_STATS } from "../data/characterStats";
import CharacterInfoCard from "../ui/CharacterInfoCard";

export default class CharacterSelectScene extends Phaser.Scene {
	/** Carte d'information affichant les stats du personnage survolé. */
	private infoCard!: CharacterInfoCard;

	constructor() {
		super("CharacterSelect");
	}

	/**
	 * Initialise la scène :
	 * - Affichage du fond et du titre
	 * - Création de la carte d'information
	 * - Instanciation des personnages interactifs
	 * - Gestion du bouton retour
	 */
	create() {
		const { width, height } = this.scale;

		this.add.rectangle(0, 0, width, height, 0x1a1e42).setOrigin(0);

		this.add
			.text(width / 2, 80, "SELECTION DU PERSONNAGE", {
				fontSize: "48px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
				stroke: "#000000",
				strokeThickness: 6,
			})
			.setOrigin(0.5);

		this.infoCard = new CharacterInfoCard(this, width - 260, height / 2);

		/**
		 * Crée un sprite interactif représentant un personnage.
		 *
		 * @param x Position horizontale du sprite
		 * @param key Clé de la texture du sprite
		 * @param statsId Identifiant des stats dans CHARACTER_STATS
		 * @param disabled Si le personnage est non sélectionnable
		 * @returns L'image du personnage créée
		 */

		const createCharacter = (
			x: number,
			key: string,
			statsId: keyof typeof CHARACTER_STATS,
			disabled = false,
		) => {
			const img = this.add
				.image(x, height / 2, key)
				.setScale(2)
				.setInteractive({ useHandCursor: !disabled });

			// Personnage verrouillé
			if (disabled) {
				img.setTint(0x000000).setAlpha(0.3);
				return img;
			}

			// Hover → agrandissement + Affiche la carte info
			img.on("pointerover", () => {
				this.tweens.add({
					targets: img,
					scale: 2.2,
					angle: 3,
					duration: 150,
				});
				this.infoCard.show(CHARACTER_STATS[statsId]);
			});

			// Sortie du hover → reset + cache la carte
			img.on("pointerout", () => {
				this.tweens.add({
					targets: img,
					scale: 2,
					angle: 0,
					duration: 150,
				});
				this.infoCard.hide();
			});

			// Sélection → Charge le jeu avec ce personnage
			img.on("pointerdown", () => {
				this.registry.set("selected_character", statsId);
				this.scene.start("Game");
			});

			return img;
		};

		// Personnages
		createCharacter(width / 2 - 200, "player1", "yellow");
		createCharacter(width / 2, "player2", "green", true);
		createCharacter(width / 2 + 200, "player3", "purple", true);

		this.add
			.text(40, 40, "← Retour", {
				fontSize: "28px",
				fontFamily: "DynaPuff",
				color: "#ffffff",
			})
			.setInteractive()
			.on("pointerdown", () => this.scene.start("Menu"));
	}
}
