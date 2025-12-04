import Phaser from "phaser";

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    const { width, height } = this.scale;

    // Fond
    this.add.rectangle(0, 0, width, height, 0x0a0a1a, 1).setOrigin(0);

    // Titre
    this.add
      .text(width / 2, 80, "SELECTION DU HERO", {
        fontSize: "48px",
        fontFamily: "DynaPuff",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Personnage Jaune
    const yellow = this.add
      .image(width / 2 - 200, height / 2, "player1")
      .setScale(2)
      .setInteractive({ useHandCursor: true });

    yellow.on("pointerdown", () => {
      this.registry.set("selected_character", "yellow");
      this.scene.start("Game");
    });

    // Personnage Vert
    this.add
      .image(width / 2, height / 2, "player2")
      .setScale(2)
      .setTint(0x000000)
      .setAlpha(0.3);

    // Personnage Violet
    this.add
      .image(width / 2 + 200, height / 2, "player3")
      .setScale(2)
      .setTint(0x000000)
      .setAlpha(0.3);

    // --- Bouton retour ---
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
