import Phaser from "phaser";

export default class Brick extends Phaser.Physics.Arcade.Sprite {
	public isHeld = false;
	public holder: Phaser.Physics.Arcade.Sprite | null = null;
	public lifespan: number;
	public canBePicked = true;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		type: "brown" | "grey",
	) {
		super(scene, x, y, "brick");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.lifespan = type === "brown" ? 1 : 2;

		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setCollideWorldBounds(true);
		body.setBounce(0.3, 0.3);
		body.setDrag(200, 0);
		body.setAllowGravity(true);
	}

	update() {
		if (this.isHeld && this.holder) {
			const offsetX = this.holder.flipX ? -20 : 20;
			this.x = this.holder.x + offsetX;
			this.y = this.holder.y - 20;
		}
	}

	throw(direction: number) {
		this.isHeld = false;
		this.holder = null;

		const body = this.body as Phaser.Physics.Arcade.Body;

		this.canBePicked = false;

		body.enable = true;
		body.setAllowGravity(true);

		body.checkCollision.none = false;
		body.checkCollision.up = true;
		body.checkCollision.down = true;
		body.checkCollision.left = true;
		body.checkCollision.right = true;

		this.setImmovable(false);

		body.setVelocity(600 * direction, -200);

		this.scene.time.delayedCall(250, () => {
			this.canBePicked = true;
		});
	}

	hit() {
		this.lifespan--;

		if (this.lifespan <= 0) {
			this.destroy();
		} else {
			this.setTint(0xffaaaa);
			this.scene.time.delayedCall(100, () => this.clearTint());
		}
	}
}
