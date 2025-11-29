import Enemy from "../Enemy";

export default class EnemyWorm extends Enemy {
	private speed: number;
	private minX: number;
	private maxX: number;

	constructor(scene: Phaser.Scene, x: number, y: number, props: any) {
		super(scene, x, y, "worm_idle");

		this.speed = props.speed ?? 30;
		this.minX = props.patrolMinX ?? x - 40;
		this.maxX = props.patrolMaxX ?? x + 40;

		// Hitbox
		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setSize(this.width * 0.8, this.height * 0.6);
		body.setOffset(this.width * 0.1, this.height * 0.4);

		scene.events.once("update", () => {
			body.setAllowGravity(true);
			body.setVelocityX(this.speed);
			body.moves = true;

			this.play("worm-walk", true);
		});
		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;

			body.setAllowGravity(true);
			body.setCollideWorldBounds(true);
			body.setVelocityX(this.speed);
			body.moves = true;

			this.play("worm-walk", true);
		});
	}

	update() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		// Patrouille
		if (this.x <= this.minX) {
			body.setVelocityX(this.speed);
			this.flipX = true;
		} else if (this.x >= this.maxX) {
			body.setVelocityX(-this.speed);
			this.flipX = false;
		}
	}

	squash() {
		this.play("worm-flat");
		const body = this.body as Phaser.Physics.Arcade.Body;

		body.enable = false;
		body.stop();
		body.setVelocity(0, 0);

		// Effet de disparition
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			scaleX: 0.6,
			scaleY: 0.4,
			duration: 250,
			onComplete: () => this.destroy(),
		});
	}
	die() {
		this.squash();
	}
}
