import Phaser from "phaser";

export default class CharacterSelectScene extends Phaser.Scene {
  private selected = 0;
  private characters = ["player1", "player2", "player3"];
  private unlocked = ["player1"];
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

    // --- Portraits ---
    const startX = width / 2 - (this.characters.length - 1) * 120;

    this.characters.forEach((key, i) => {
      const img = this.add
        .image(startX + i * 240, height / 2, key)
        .setScale(2)
        .setInteractive({ useHandCursor: true });

      // Si le personnage est verrouillé :
      if (!this.unlocked.includes(key)) {
        img.setTint(0x000000); // Ombre
        img.setAlpha(0.3); // Transparence
        img.disableInteractive(); // Pas cliquable
      }

      this.portraits.push(img);

      // Clic uniquement si non verrouillé
      if (this.unlocked.includes(key)) {
        img.on("pointerdown", () => {
          this.selectCharacter(i);
        });
      }
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

    // Sélectionner automatiquement le premier personnage débloqué
    this.selectCharacter(
      this.characters.findIndex((c) => this.unlocked.includes(c))
    );
  }

  selectCharacter(index: number) {
    const chosenKey = this.characters[index];

    // Sécurité : empêchons la sélection d’un perso bloqué
    if (!this.unlocked.includes(chosenKey)) return;

    this.selected = index;

    this.portraits.forEach((img, i) => {
      if (i === index) {
        img.clearTint();
        img.setAlpha(1);
        img.setScale(2.5);
      } else {
        const key = this.characters[i];

        if (this.unlocked.includes(key)) {
          img.setTint(0x666666);
          img.setAlpha(0.8);
          img.setScale(2);
        } else {
          img.setTint(0x000000);
          img.setAlpha(0.3);
          img.setScale(2);
        }
      }
    });
  }

  startGame() {
    const selectedKey = this.characters[this.selected];
    this.registry.set("selectedCharacter", selectedKey);
    this.scene.start("Game");
  }
}
