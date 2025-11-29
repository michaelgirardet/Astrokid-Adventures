import Enemy from "../Enemy";

export default class EnemyFly extends Enemy {
	private speed: number;
	private minX: number;
	private maxX: number;

	constructor(scene, x, y, props) {
		super(scene, x, y, "fly_a");

		this.speed = props.speed ?? 100;
		this.minX = props.patrolMinX ?? x - 50;
		this.maxX = props.patrolMaxX ?? x + 50;

		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;
			body.setAllowGravity(false);
			body.setCollideWorldBounds(false);
			body.moves = true;

			body.setVelocityX(this.speed);

			this.anims.play("fly-walk", true);
			this.setDepth(1000);
		});
	}

	update(time: number, delta: number) {
		const body = this.body as Phaser.Physics.Arcade.Body;

		// Patrol
		if (this.x <= this.minX) {
			body.setVelocityX(this.speed);
			this.flipX = true;
		} else if (this.x >= this.maxX) {
			body.setVelocityX(-this.speed);
			this.flipX = false;
		}
	}
	die() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		this.anims.play("fly-rest", true);

		// Stoppe immédiatement les interactions physiques
		body.stop();
		body.setVelocity(0, 0);
		body.setAllowGravity(false);
		body.enable = false;

		// Facultatif : désactiver X movement
		this.speed = 0;
	}
}
