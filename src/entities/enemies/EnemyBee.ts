import Enemy from "../Enemy";

export default class EnemyBee extends Enemy {
	private speed: number;
	private minX: number;
	private maxX: number;
	private buzzTimer = 0;

	constructor(scene, x, y, props) {
		super(scene, x, y, "bee_a");

		this.speed = props.speed ?? 80;
		this.minX = props.patrolMinX ?? x - 60;
		this.maxX = props.patrolMaxX ?? x + 60;

		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;

			body.setAllowGravity(false);
			body.moves = true;
			body.setVelocityX(props.direction === "left" ? -this.speed : this.speed);

			this.flipX = props.direction === "left";

			this.play("bee-fly", true);
		});
	}

	update(_time: number, delta: number) {
		const body = this.body as Phaser.Physics.Arcade.Body;

		// Patrouille
		if (this.x <= this.minX) {
			body.setVelocityX(this.speed);
			this.flipX = true;
		} else if (this.x >= this.maxX) {
			body.setVelocityX(-this.speed);
			this.flipX = false;
		}

		// Effet "Buzz"
		this.buzzTimer += delta;

		this.y += Math.sin(this.buzzTimer * 0.005) * 0.4;

		// Zigzag vertical
		const zigzagAmp = 6;
		const zigzagSpeed = 0.003;
		this.y +=
			Math.sin(this.buzzTimer * zigzagSpeed) * (zigzagAmp * delta * 0.01);
	}

	die() {
		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setVelocity(0, 0);
		body.setAllowGravity(true);
		body.enable = false;

		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: 400,
			onComplete: () => {
				this.destroy();
			},
		});
	}
}
