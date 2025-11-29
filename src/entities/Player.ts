export default class Player extends Phaser.Physics.Arcade.Sprite {
	private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
	private runKey!: Phaser.Input.Keyboard.Key;
	heldBrick?: Phaser.Physics.Arcade.Sprite;
	throwKey!: Phaser.Input.Keyboard.Key;

	isInvincible = false;
	invincibleTimer = 0;
	disableControls = false;
	isHit = false;
	isDucking = false;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "player_idle");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setGravityY(300);
		this.setCollideWorldBounds(true);

		(this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(350, 900);

		// Hitbox standard
		this.body.setSize(this.width * 0.6, this.height * 0.9);
		this.body.setOffset(this.width * 0.2, this.height * 0.1);

		// Controls
		this.cursors = scene.input.keyboard.createCursorKeys();
		this.runKey = scene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SHIFT,
		);
		this.throwKey = scene.input.keyboard.addKey(
			Phaser.Input.Keyboard.KeyCodes.SPACE,
		);
	}

	// --------------------------
	//  DUCK HANDLERS
	// --------------------------
	enterDuck() {
		this.setVelocityX(0);
		this.play("player-duck", true);

		// Hitbox réduite
		this.body.setSize(this.width * 0.6, this.height * 0.5);
		this.body.setOffset(this.width * 0.2, this.height * 0.45);
	}

	exitDuck() {
		// Reset hitbox
		this.body.setSize(this.width * 0.6, this.height * 0.9);
		this.body.setOffset(this.width * 0.2, this.height * 0.1);
	}

	update(_time: number, delta: number) {
		if (this.disableControls) return;

		if (this.isHit) {
			this.play("player-hit", true);
			return;
		}

		// --- INVINCIBILITÉ ---
		if (this.isInvincible) {
			this.invincibleTimer -= delta;
			if (this.invincibleTimer <= 0) {
				this.isInvincible = false;
				this.clearTint();
				this.setAlpha(1);
			}
		}

		// --- DUCK ---
		if (this.cursors.down.isDown && this.body.blocked.down && !this.isDucking) {
			this.isDucking = true;
			this.enterDuck();
		}

		if (!this.cursors.down.isDown && this.isDucking) {
			this.isDucking = false;
			this.exitDuck();
		}

		// Si on est accroupi → rien d'autre ne doit se produire
		if (this.isDucking) {
			return;
		}

		// --- RUN SPEED ---
		const baseSpeed = 200;
		const runSpeed = 350;
		const speed = this.runKey.isDown ? runSpeed : baseSpeed;

		// --- MOVE ---
		if (this.cursors.left.isDown) {
			this.setVelocityX(-speed);
			this.setFlipX(true);
		} else if (this.cursors.right.isDown) {
			this.setVelocityX(speed);
			this.setFlipX(false);
		} else {
			this.setVelocityX(0);
		}

		// --- JUMP ---
		if (
			Phaser.Input.Keyboard.JustDown(this.cursors.up) &&
			this.body.blocked.down
		) {
			this.setVelocityY(-800);
			const sc = this.scene as Phaser.Scene & {
				jumpSound?: { play: () => void };
			};
			if (sc.jumpSound) sc.jumpSound.play();
		}

		// --- HELD BRICK ---
		if (this.heldBrick) {
			this.heldBrick.setPosition(this.x, this.y - 40);
		}

		if (Phaser.Input.Keyboard.JustDown(this.throwKey) && this.heldBrick) {
			this.heldBrick.throw(this.flipX ? -1 : 1);
			this.heldBrick = undefined;
			console.log("BRIQUE LANCÉE !");
		}

		// --- ANIMATIONS ---
		if (!this.body.blocked.down) {
			this.play("player-jump", true);
			return;
		}

		if (this.cursors.left.isDown || this.cursors.right.isDown) {
			this.play("player-walk", true);
			return;
		}

		this.play("player-idle", true);
	}
}
