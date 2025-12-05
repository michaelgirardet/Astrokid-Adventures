import Phaser from "phaser";

export default class InputManager {
	private scene: Phaser.Scene;

	// Keyboard state
	private keys: Record<string, Phaser.Input.Keyboard.Key> = {};

	constructor(scene: Phaser.Scene) {
		this.scene = scene;

		const k = Phaser.Input.Keyboard.KeyCodes;

		// Multiple bindings for each action (QWERTY + AZERTY)
		this.keys = {
			left: scene.input.keyboard.addKey(k.LEFT),
			right: scene.input.keyboard.addKey(k.RIGHT),
			up: scene.input.keyboard.addKey(k.UP),
			down: scene.input.keyboard.addKey(k.DOWN),
			w: scene.input.keyboard.addKey(k.W),
			a: scene.input.keyboard.addKey(k.A),
			s: scene.input.keyboard.addKey(k.S),
			d: scene.input.keyboard.addKey(k.D),
			z: scene.input.keyboard.addKey(k.Z), // For ZQSD
			q: scene.input.keyboard.addKey(k.Q), // For ZQSD
			space: scene.input.keyboard.addKey(k.SPACE),
			shift: scene.input.keyboard.addKey(k.SHIFT)
		};
	}

	// ----- ACTION HELPERS -----

	isLeft(): boolean {
		return this.keys.left.isDown || this.keys.a.isDown || this.keys.q.isDown;
	}

	isRight(): boolean {
		return this.keys.right.isDown || this.keys.d.isDown;
	}

	isUp(): boolean {
		return this.keys.up.isDown || this.keys.w.isDown || this.keys.z.isDown;
	}

	isDown(): boolean {
		return this.keys.down.isDown || this.keys.s.isDown;
	}

	isRunning(): boolean {
		return this.keys.shift.isDown;
	}

	isActionPressed(): boolean {
		return Phaser.Input.Keyboard.JustDown(this.keys.space);
	}

	isJumpPressed(): boolean {
		return Phaser.Input.Keyboard.JustDown(this.keys.up) ||
			Phaser.Input.Keyboard.JustDown(this.keys.w) ||
			Phaser.Input.Keyboard.JustDown(this.keys.z);
	}
}
