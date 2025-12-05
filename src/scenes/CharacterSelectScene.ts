import Phaser from "phaser";
import { CHARACTER_STATS } from "../data/characterStats";
import CharacterInfoCard from "../ui/CharacterInfoCard";

export default class CharacterSelectScene extends Phaser.Scene {
	private infoCard!: CharacterInfoCard;

	constructor() {
		super("CharacterSelect");
	}

	create() {
		const { width, height } = this.scale;

		this.add.rectangle(0, 0, width, height, 0x446daa).setOrigin(0);

		this.add.text(width / 2, 80, "SELECTION DU PERSONNAGE", {
			fontSize: "48px",
			fontFamily: "DynaPuff",
			color: "#ffffff",
			stroke: "#000000",
			strokeThickness: 6
		}).setOrigin(0.5);

		// 🔥 Ajout du panneau d’info
		this.infoCard = new CharacterInfoCard(this, width - 260, height / 2);

		// Utilitaire pour créer un personnage interactif
		const createCharacter = (
			x: number,
			key: string,
			statsId: keyof typeof CHARACTER_STATS,
			disabled = false
		) => {
			const img = this.add
				.image(x, height / 2, key)
				.setScale(2)
				.setInteractive({ useHandCursor: !disabled });

			if (disabled) {
				img.setTint(0x000000).setAlpha(0.3);
				return img;
			}

			img.on("pointerover", () => {
				this.tweens.add({
					targets: img,
					scale: 2.2,
					angle: 3,
					duration: 150
				});
				this.infoCard.show(CHARACTER_STATS[statsId]);
			});

			img.on("pointerout", () => {
				this.tweens.add({
					targets: img,
					scale: 2,
					angle: 0,
					duration: 150
				});
				this.infoCard.hide();
			});

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

		// Bouton retour
		this.add.text(40, 40, "← Retour", {
			fontSize: "28px",
			fontFamily: "DynaPuff",
			color: "#ffffff"
		})
			.setInteractive()
			.on("pointerdown", () => this.scene.start("Menu"));
	}
}
