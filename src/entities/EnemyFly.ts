export default class EnemyFly extends Phaser.Physics.Arcade.Sprite {

    speed = 100;
    direction = 1;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, "enemy_idle");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setVelocityX(this.speed);
        this.setBounce(1, 0);
        this.setCollideWorldBounds(true);
    }

    update() {
        if (this.body.blocked.left) this.setVelocityX(this.speed);
        if (this.body.blocked.right) this.setVelocityX(-this.speed);
    }
}
