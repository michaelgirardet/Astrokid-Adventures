import Phaser from "phaser";

export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setImmovable(false);
	}

	abstract update(time: number, delta: number): void;
}
