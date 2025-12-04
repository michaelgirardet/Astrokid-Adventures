import Phaser from "phaser";

export default class CharacterSelectScene extends Phaser.Scene {
  private selected = 0;
  private characters = ["player1", "player2", "player3"];
  private portraits: Phaser.GameObjects.Image[] = [];

  constructor() {
    super("CharacterSelect");
  }

  create() {
    const { width, height } = this.scale;

    // Fond
    this.add.rectangle(0, 0, width, height, 0x0a0a1a, 1).setOrigin(0);

    this.add
      .text(width / 2, 80, "CHOISIS TON PERSONNAGE", {
        fontSize: "48px",
        fontFamily: "DynaPuff",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 6,
      })
      .setOrigin(0.5);

    // Portraits
    const startX = width / 2 - (this.characters.length - 1) * 120;

    this.characters.forEach((key, i) => {
      const img = this.add
        .image(startX + i * 240, height / 2, key)
        .setScale(2)
        .setInteractive({ useHandCursor: true });

      this.portraits.push(img);

      img.on("pointerdown", () => {
        this.selectCharacter(i);
      });
    });

    // Bouton valider
    const playBtn = this.add
      .rectangle(width / 2, height - 120, 260, 70, 0x00d4ff)
      .setOrigin(0.5)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(width / 2, height - 120, "VALIDER", {
        fontSize: "32px",
        fontFamily: "DynaPuff",
        color: "#0a0e27",
      })
      .setOrigin(0.5);

    playBtn.on("pointerdown", () => this.startGame());

    // Bouton retour
    const backText = this.add
      .text(40, 40, "← Retour", {
        fontSize: "28px",
        fontFamily: "DynaPuff",
        color: "#ffffff",
      })
      .setInteractive();

    backText.on("pointerdown", () => {
      this.scene.start("Menu");
    });

    this.selectCharacter(0);
  }

  selectCharacter(index: number) {
    this.selected = index;

    // Mise en avant du perso sélectionné
    this.portraits.forEach((img, i) => {
      img.setTint(i === index ? 0xffffff : 0x666666);
      img.setScale(i === index ? 2.5 : 2);
    });
  }

  startGame() {
    this.registry.set("selectedCharacter", this.characters[this.selected]);
    this.scene.start("Game");
  }
}
