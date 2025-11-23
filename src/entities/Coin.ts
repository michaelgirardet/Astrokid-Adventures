export default class Coin extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "star");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(0.3);
        this.setCircle(10);
    }
}
