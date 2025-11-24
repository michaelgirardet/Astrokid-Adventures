export default class Coin extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "Coin");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable(true);
        this.setCircle(10); 
        this.setOffset(6, 6); // centre la hitbox
    }
}
