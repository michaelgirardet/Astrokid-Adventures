export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super("Victory");
  }

  create() {
    const { width, height } = this.scale;

    // Couleurs de la palette
    const COLOR_BG = 0x0a0e27;
    const COLOR_PANEL = 0x1e1b33;
    const COLOR_ACCENT = 0x00d4ff;
    const COLOR_TEXT = "#f5f1e8";
    const COLOR_STROKE = "#0a0e27";

    this.add.rectangle(0, 0, width, height, COLOR_BG, 0.75).setOrigin(0);

    const panel = this.add
      .rectangle(width / 2, height / 2, 520, 380, COLOR_PANEL, 0.85)
      .setOrigin(0.5)
      .setStrokeStyle(4, COLOR_ACCENT)
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
        stroke: COLOR_STROKE,
        strokeThickness: 8,
      })
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: title,
      alpha: 1,
      duration: 800,
      ease: "Power2",
    });

    // Récupération des stats
    const score = this.registry.get("lastScore") ?? 0;
    const stars = this.registry.get("lastStars") ?? 0;
    const time = this.registry.get("lastTime") ?? 0;

    // Texte de stats
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
          stroke: COLOR_STROKE,
          strokeThickness: 4,
        }
      )
      .setOrigin(0.5)
      .setAlpha(0);

    this.tweens.add({
      targets: statsText,
      alpha: 1,
      duration: 600,
      delay: 300,
    });

    // Bouton
    this.createButton(width / 2, height / 2 + 120, "▶ CONTINUER", () =>
      this.goToMenu()
    );
    this.cameras.main.fadeIn(400, 0, 0, 0);
  }

  createButton(x: number, y: number, label: string, callback: () => void) {
    const COLOR_ACCENT = 0x00d4ff;
    const COLOR_STROKE = "#0a0e27";

    const radius = 20;
    const width = 300;
    const height = 70;

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
      button.setTint(0x4beaff);
      this.tweens.add({ targets: [button, text], scale: 1.07, duration: 150 });
    });

    button.on("pointerout", () => {
      button.clearTint();
      this.tweens.add({ targets: [button, text], scale: 1, duration: 150 });
    });

    button.on("pointerdown", () => callback());
  }

  goToMenu() {
    this.cameras.main.fadeOut(400, 0, 0, 0);
    this.time.delayedCall(400, () => {
      this.scene.start("Menu");
    });
  }
}
