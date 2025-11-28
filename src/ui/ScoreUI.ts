export default class ScoreUI {
    private text: Phaser.GameObjects.Text;
    private score: number = 0;
    
    constructor(scene: Phaser.Scene) {
       const width = scene.cameras.main.width;
        this.text = scene.add.text(width - 48, 16, "Score: 0", {
            fontFamily: "DynaPuff",
            fontSize: "32px",
            color: "#fff",
            stroke: "#000",
            strokeThickness: 4
        });

        this.text.setOrigin(1, 0);
        this.text.setScrollFactor(0);
        this.text.setDepth(1000);
        this.text.setScrollFactor(0); 
    }

    add(points: number) {
        this.score += points;
        this.text.setText("Score: " + this.score);
    }
}
