export default class ScoreUI {
    private text: Phaser.GameObjects.Text;
    private score: number = 0;

    constructor(scene: Phaser.Scene) {
        this.text = scene.add.text(16, 16, 'Score: 0', {
            fontSize: '32px',
            color: '#fff',
            stroke: '#000',
            strokeThickness: 4
        });
    }

    add(points: number) {
        this.score += points;
        this.text.setText('Score: ' + this.score);
    }
}
