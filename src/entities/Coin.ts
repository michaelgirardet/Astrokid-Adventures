export default class Coin extends Phaser.Physics.Arcade.Sprite {

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "Coin");

        scene.add.existing(this);
        scene.physics.add.existing(this);
        
        // Désactive les mouvements physiques
        (this.body as Phaser.Physics.Arcade.Body).moves = false;

        this.setCircle(10); 
        this.setOrigin(0.5, 0.5);
    }
}