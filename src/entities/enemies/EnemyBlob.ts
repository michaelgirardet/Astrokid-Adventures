import Enemy from "../Enemy";

export default class EnemyBlob extends Enemy {
	private speed: number;
	private minX: number;
	private maxX: number;
	private jumpTimer = 0;

	constructor(scene, x, y, props) {
		super(scene, x, y, "blob_idle");

		this.speed = props.speed ?? 40;
		this.minX = props.patrolMinX ?? x - 50;
		this.maxX = props.patrolMaxX ?? x + 50;

		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;
			body.setAllowGravity(true);
			body.setCollideWorldBounds(true);

			if (props.direction === "left") {
				body.setVelocityX(-this.speed);
				this.flipX = true;
			} else {
				body.setVelocityX(this.speed);
				this.flipX = false;
			}
		});
	}

	update(_time: number, delta: number) {
		const body = this.body as Phaser.Physics.Arcade.Body;

		if (this.x <= this.minX) {
			body.setVelocityX(this.speed);
			this.flipX = true;
		} else if (this.x >= this.maxX) {
			body.setVelocityX(-this.speed);
			this.flipX = false;
		}

		this.jumpTimer += delta;
		const jumpInterval = Phaser.Math.Between(800, 1600); // Delay entre les sauts

		if (this.jumpTimer > jumpInterval && body.blocked.down) {
			body.setVelocityY(-100); // Hauteur des sauts
			this.jumpTimer = 0;
		}

		this.play("blob-walk", true);
	}

	squash() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		body.setVelocity(0, 0);
		body.enable = false;

		this.setTexture("blob_flat");
		this.setScale(1.1, 0.7);

		this.scene.time.delayedCall(250, () => {
			this.destroy();
		});
	}
	die() {
		this.squash();
	}
}
