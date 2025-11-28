import Phaser from "phaser";

export default class Brick extends Phaser.Physics.Arcade.Sprite {
	public isHeld = false; // portée par le joueur ?
	public holder: Phaser.Physics.Arcade.Sprite | null = null;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "brick");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setCollideWorldBounds(true);
		body.setBounce(0, 1);
		body.setDrag(200, 0);
		body.setAllowGravity(false);
	}

	update() {
		if (this.isHeld && this.holder) {
			this.x = this.holder.x + (this.holder.flipX ? -20 : 20);
			this.y = this.holder.y - 20;
		}
	}

	throw(direction: number) {
		this.isHeld = false;
		this.holder = null;

		const body = this.body as Phaser.Physics.Arcade.Body;
		body.enable = true;

		// Activer la gravité après lancement
		body.setAllowGravity(true);

		// lancer horizontal
		body.setVelocityX(500 * direction);
		body.setVelocityY(-200);

		body.checkCollision.none = true;

		this.scene.time.delayedCall(250, () => {
			body.checkCollision.none = false;
		});
	}
}
