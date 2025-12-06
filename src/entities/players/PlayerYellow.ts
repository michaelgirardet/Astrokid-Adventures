import PlayerBase from "../Player";

export default class PlayerYellow extends PlayerBase {
	protected getSkinKey() {
		return "player1";
	}

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);

		this.maxSpeed = 230;
		this.jumpForce = 850;
	}
}
