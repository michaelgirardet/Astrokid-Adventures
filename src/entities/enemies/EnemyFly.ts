import Enemy from "../Enemy";

export default class EnemyFly extends Enemy {

    private speed: number;
    private minX: number;
    private maxX: number;

    constructor(scene: Phaser.Scene, x: number, y: number, props: any) {
        super(scene, x, y, "enemy_idle");

        this.speed = props.speed ?? 100;
        this.minX = props.patrolMinX ?? x - 50;
        this.maxX = props.patrolMaxX ?? x + 50;

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.allowGravity = false;
        body.setVelocityX(this.speed);
        body.setCollideWorldBounds(false);
    }

    update(time: number, delta: number) {
        const body = this.body as Phaser.Physics.Arcade.Body;

        if (this.x <= this.minX) {
            body.setVelocityX(this.speed);
            this.flipX = false;
        }
        else if (this.x >= this.maxX) {
            body.setVelocityX(-this.speed);
            this.flipX = true;
        }
    }
}
