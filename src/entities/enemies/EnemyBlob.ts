import Enemy from "../Enemy";

export default class EnemyBlob extends Enemy {

    private speed: number;
    private minX: number;
    private maxX: number;
    private jumpTimer = 0;

    constructor(scene: Phaser.Scene, x: number, y: number, props: any) {
        super(scene, x, y, "blob_idle");

        this.speed = props.speed ?? 40;
        this.minX = props.patrolMinX ?? x - 50;
        this.maxX = props.patrolMaxX ?? x + 50;

        const body = this.body as Phaser.Physics.Arcade.Body;

        body.setAllowGravity(true);
        body.setCollideWorldBounds(true);
        body.setVelocityX(this.speed);
    }

    update(time: number, delta: number) {
        const body = this.body as Phaser.Physics.Arcade.Body;

        // Patrouille
        if (this.x <= this.minX) {
            body.setVelocityX(this.speed);
            this.flipX = false;
        }
        else if (this.x >= this.maxX) {
            body.setVelocityX(-this.speed);
            this.flipX = true;
        }

        // Petit saut
        this.jumpTimer += delta;
        if (this.jumpTimer > 2000 && body.blocked.down) {
            body.setVelocityY(-50);
            this.jumpTimer = 0;
        }

        this.play("blob-walk", true);
    }
}

