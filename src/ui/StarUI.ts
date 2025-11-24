export default class StarUI {
    private scene: Phaser.Scene;
    private starIcon: Phaser.GameObjects.Image;
    private text: Phaser.GameObjects.Text;
    private count: number = 0;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        

        // Petite icône d'étoile dans le HUD
        this.starIcon = scene.add.image(20, 60, "Star")
            .setScale(0.7)
            .setScrollFactor(0);

        // Texte du compteur
        this.text = scene.add.text(45, 50, "0", {
            fontSize: "28px",
            color: "#fff",
            stroke: "#000",
            strokeThickness: 4
        }).setScrollFactor(0);
    }

    addStar() {
        this.count++;
        this.text.setText(this.count.toString());
    }

    getCount() {
        return this.count;
    }
}
