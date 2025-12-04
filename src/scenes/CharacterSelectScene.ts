import Phaser from "phaser";

export default class CharacterSelectScene extends Phaser.Scene {
  constructor() {
    super("CharacterSelect");
  }

  create() {
    const { width, height } = this.scale;
    // Fond
    this.add.rectangle(0, 0, width, height, 0x446daa, 1).setOrigin(0);

    // Titre
    this.add
      .text(width / 2, 80, "SELECTION DU PERSONNAGE", {
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

    yellow.on("pointerover", () => {
      this.tweens.add({
        targets: yellow,
        scale: 2.2,
        angle: 3,
        duration: 150,
        ease: "Power2",
      });
    });
    yellow.on("pointerout", () => {
      this.tweens.add({
        targets: yellow,
        scale: 2,
        angle: 0,
        duration: 150,
        ease: "Power2",
      });
    });
    yellow.on("pointerdown", () => {
      this.registry.set("selected_character", "yellow");
      this.scene.start("Game");
    });

    // Personnage Vert
    const green = this.add
      .image(width / 2, height / 2, "player2")
      .setScale(2)
      .setTint(0x000000)
      .setAlpha(0.3);

    // Ajout du "?" sur l'ombre
    this.add
      .text(green.x, green.y + 35, "?", {
        fontSize: "60px",
        fontFamily: "DynaPuff",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Personnage Violet
    const purple = this.add
      .image(width / 2 + 200, height / 2, "player3")
      .setScale(2)
      .setTint(0x000000)
      .setAlpha(0.3);

    // "?" sur l'ombre
    this.add
      .text(purple.x, purple.y + 35, "?", {
        fontSize: "60px",
        fontFamily: "DynaPuff",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Bouton retour
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
