export default class Bomb extends Phaser.Physics.Arcade.Sprite {
    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'bomb');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setBounce(1);
        this.setCollideWorldBounds(true);
        this.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}
