import Phaser from "phaser";
import InputManager from "../core/InputManager";
import type Brick from "./Bricks";

export default class Player extends Phaser.Physics.Arcade.Sprite {
	private controls: InputManager;

	heldBrick?: Brick;

	isInvincible = false;
	invincibleTimer = 0;
	disableControls = false;
	isHit = false;
	isDucking = false;
	lastAnim?: string;

	// Inertie lors de la course
	private acceleration = 2000;
	private deceleration = 1200;
	private maxSpeed = 200;
	private maxRunSpeed = 350;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		skin: string = "player1",
	) {
		super(scene, x, y, skin);

		this.anims.play(`${skin}-idle`);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setGravityY(300);
		this.setCollideWorldBounds(true);

		(this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(350, 900);

		// Hitbox standard
		this.body.setSize(this.width * 0.6, this.height * 0.9);
		this.body.setOffset(this.width * 0.2, this.height * 0.1);

		// Input manager
		this.controls = new InputManager(scene);
	}
	enterDuck() {
		this.setVelocityX(0);
		if (this.lastAnim !== "player-duck") {
			this.play("player-duck");
			this.lastAnim = "player-duck";
		}

		const body = this.body as Phaser.Physics.Arcade.Body;

		const normalHeight = this.height * 0.9;
		const duckHeight = this.height * 0.5;
		const heightLoss = normalHeight - duckHeight;

		body.setSize(this.width * 0.6, duckHeight);
		body.setOffset(this.width * 0.2, this.height * 0.1 + heightLoss);
	}

	exitDuck() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		body.setSize(this.width * 0.6, this.height * 0.9);
		body.setOffset(this.width * 0.2, this.height * 0.1);

		this.lastAnim = undefined;
	}

	update(_time: number, delta: number) {
		if (this.disableControls) return;

		// Hit state
		if (this.isHit) {
			this.play("player-hit", true);
			return;
		}

		if (this.isInvincible) {
			this.invincibleTimer -= delta;
			if (this.invincibleTimer <= 0) {
				this.isInvincible = false;
				this.clearTint();
				this.setAlpha(1);
			}
		}

		// Throw brick
		if (this.controls.isActionPressed() && this.heldBrick) {
			this.heldBrick.throw(this.flipX ? -1 : 1);
			this.heldBrick = undefined;
		}

		const onGround = this.body.blocked.down;

		// Duck
		if (this.controls.isDown() && onGround) {
			if (!this.isDucking) {
				this.isDucking = true;
				this.enterDuck();
			}
		} else if (this.isDucking) {
			this.isDucking = false;
			this.exitDuck();
		}

		if (this.isDucking) return;

		// Mouvement
		const body = this.body as Phaser.Physics.Arcade.Body;

		const isRunning = this.controls.isRunning();
		const targetSpeed = isRunning ? this.maxRunSpeed : this.maxSpeed;

		if (this.controls.isLeft()) {
			// Boost au changement de direction
			const turningBoost = body.velocity.x > 10 ? 1.5 : 1;
			body.setAccelerationX(-this.acceleration * turningBoost);
			this.setFlipX(true);
		} else if (this.controls.isRight()) {
			// Boost au changement de direction
			const turningBoost = body.velocity.x < -10 ? 1.5 : 1;
			body.setAccelerationX(this.acceleration * turningBoost);
			this.setFlipX(false);
		} else {
			// Friction proportionnelle à la vitesse pour un arrêt plus naturel
			const frictionForce = this.deceleration + Math.abs(body.velocity.x) * 1.5;

			if (body.velocity.x > 0) {
				body.setAccelerationX(-frictionForce);
			} else if (body.velocity.x < 0) {
				body.setAccelerationX(frictionForce);
			}

			// Arrêt complet si vitesse très faible (évite micro-mouvements)
			if (Math.abs(body.velocity.x) < 10) {
				body.setAccelerationX(0);
				body.setVelocityX(0);
			}
		}

		if (body.velocity.x > targetSpeed)
			// Limite la vitesse max selon run / walk
			body.setVelocityX(targetSpeed);
		if (body.velocity.x < -targetSpeed) body.setVelocityX(-targetSpeed);

		// Jump
		if (this.controls.isJumpPressed() && onGround) {
			this.setVelocityY(-800);
			const sc = this.scene as Phaser.Scene & { jumpSound?: { play(): void } };
			sc.jumpSound?.play();
		}

		// Brick follow
		if (this.heldBrick) {
			this.heldBrick.setPosition(this.x, this.y - 40);
		}

		// Animation
		if (!onGround) {
			if (this.lastAnim !== "player-jump") {
				this.play("player-jump", true);
				this.lastAnim = "player-jump";
			}
			return;
		}

		if (this.controls.isLeft() || this.controls.isRight()) {
			if (this.lastAnim !== "player-walk") {
				this.play("player-walk");
				this.lastAnim = "player-walk";
			}
			return;
		}

		if (this.lastAnim !== "player-idle") {
			this.play("player-idle", true);
			this.lastAnim = "player-idle";
		}
	}
}
