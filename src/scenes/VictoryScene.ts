export default class VictoryScene extends Phaser.Scene {
    constructor() { 
        super("Victory"); 
    }

    create() {
        const { width, height } = this.scale;

        // --- Fond sombre ---
        this.add.rectangle(0, 0, width, height, 0x000000, 0.55)
            .setOrigin(0);

        // --- Panneau central ---
        const panel = this.add.rectangle(
            width / 2,
            height / 2,
            520,
            300,
            0x1a1a2e,
            0.75
        )
        .setOrigin(0.5)
        .setStrokeStyle(4, 0x00d4ff)
        .setScale(0.8);

        this.tweens.add({
            targets: panel,
            scale: 1,
            duration: 450,
            ease: "Back.easeOut"
        });

        // --- Texte principal ---
        const title = this.add.text(width / 2, height / 2 - 80, "NIVEAU TERMINÉ !", {
            fontSize: "60px",
            fontFamily: "DynaPuff",
            color: "#00d4ff",
            stroke: "#0a0e27",
            strokeThickness: 8
        }).setOrigin(0.5).setAlpha(0);

        // Apparition
        this.tweens.add({
            targets: title,
            alpha: 1,
            duration: 800,
            ease: "Power2"
        });

        // Légère pulsation
        this.tweens.add({
            targets: title,
            scale: { from: 1, to: 1.05 },
            duration: 2000,
            repeat: -1,
            yoyo: true,
            ease: "Sine.easeInOut"
        });

        // --- Bouton retour menu ---
        this.createButton(
            width / 2,
            height / 2 + 40,
            "▶ CONTINUER",
            () => this.goToMenu()
        );

        // --- Particules décoratives ---
        this.createParticles();

        // Fade-in
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    // --------------------------------------------------------------
    // Bouton arrondi réutilisable
    // --------------------------------------------------------------
    createButton(x: number, y: number, label: string, callback: Function) {
        const radius = 16;
        const width = 280;
        const height = 60;

        // Dessine bouton arrondi
        const gfx = this.add.graphics();
        gfx.fillStyle(0x00d4ff, 1);
        gfx.fillRoundedRect(0, 0, width, height, radius);
        gfx.generateTexture("victory-btn", width, height);
        gfx.destroy();

        const button = this.add.image(x, y, "victory-btn").setOrigin(0.5);
        const text = this.add.text(x, y, label, {
            fontSize: "28px",
            fontFamily: "DynaPuff",
            color: "#0a0e27",
            stroke: "#00eaff",
            strokeThickness: 2
        }).setOrigin(0.5);

        button.setInteractive({ useHandCursor: true });

        button.on("pointerover", () => {
            button.setTint(0x00f6ff);
            this.tweens.add({ targets: [button, text], scale: 1.08, duration: 150 });
        });

        button.on("pointerout", () => {
            button.clearTint();
            this.tweens.add({ targets: [button, text], scale: 1, duration: 150 });
        });

        button.on("pointerdown", () => callback());
    }

    // --------------------------------------------------------------
    // Particules décoratives (échos bleus)
    // --------------------------------------------------------------
    createParticles() {
        const { width, height } = this.scale;

        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, width);
            const y = Phaser.Math.Between(height, height + 200);
            const size = Phaser.Math.Between(4, 8);

            const p = this.add.circle(x, y, size, 0x00d4ff, 0.3);

            this.tweens.add({
                targets: p,
                y: y - Phaser.Math.Between(300, 600),
                alpha: { from: 0.5, to: 0 },
                duration: Phaser.Math.Between(2500, 4500),
                delay: Phaser.Math.Between(0, 1500),
                repeat: -1,
                ease: "Sine.easeOut"
            });
        }
    }

    // --------------------------------------------------------------
    // Transition vers le menu
    // --------------------------------------------------------------
    goToMenu() {
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(500, () => {
            this.scene.start("Menu");
        });
    }
}
