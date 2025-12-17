interface PlatformProps {
	speed?: number;
	minX?: number;
	maxX?: number;
}

export default class MovingPlatformHorizontal extends Phaser.Physics.Arcade.Sprite {
	private speed = 80;
	private minX = 0;
	private maxX = 0;

constructor(scene: Phaser.Scene, x: number, y: number) {
	super(scene, x, y, "platform"); 

	scene.add.existing(this);
	scene.physics.add.existing(this);

	const body = this.body as Phaser.Physics.Arcade.Body;
	body.setImmovable(true);
	body.allowGravity = false;
	body.moves = true;
}

	init(props: PlatformProps) {
		this.speed = props.speed ?? 80;
		this.minX = props.minX ?? this.x - 100;
		this.maxX = props.maxX ?? this.x + 100;

		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setVelocityX(this.speed);
	}

	preUpdate(time: number, delta: number) {
		super.preUpdate(time, delta);

		const body = this.body as Phaser.Physics.Arcade.Body;

		if (this.x <= this.minX && body.velocity.x < 0) body.setVelocityX(this.speed);
		if (this.x >= this.maxX && body.velocity.x > 0) body.setVelocityX(-this.speed);
	}
}
