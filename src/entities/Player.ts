import Phaser from "phaser";
import InputManager from "../core/InputManager";
import type Brick from "./Bricks";

/**
 * Classe de base abstraite pour tous les joueurs.
 *
 * @remarks
 * Contient toute la physique, mouvements, collisions, animations génériques.
 * Les classes enfants doivent simplement définir :
 * - getSkinKey()
 * - éventuellement overrides pour stats (speed, jumpForce…)
 */
export default abstract class Player extends Phaser.Physics.Arcade.Sprite {
	protected controls: InputManager;

	heldBrick?: Brick;

	isInvincible = false;
	invincibleTimer = 0;

	disableControls = false;
	isHit = false;
	isDucking = false;

	lastAnim?: string;

	// ---- Stats modifiables par les classes enfants ----
	protected acceleration = 2000;
	protected deceleration = 1200;
	protected maxSpeed = 200;
	protected maxRunSpeed = 350;
	protected jumpForce = 800;

	/**
	 * Les classes enfants doivent retourner le nom du spritesheet.
	 * ex: "player1", "player_yellow", etc.
	 */
	protected abstract getSkinKey(): string;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "");

		const skin = this.getSkinKey();
		this.setTexture(skin);

		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setGravityY(300);
		this.setCollideWorldBounds(true);

		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;

			body.setSize(this.width * 0.6, this.height * 0.9);
			body.setOffset(this.width * 0.2, this.height * 0.1);

			body.setMaxVelocity(350, 900);
		});

		this.controls = new InputManager(scene);
	}

	// LOGIQUE PARTAGÉE
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

		// Lancer une brique
		if (this.controls.isActionPressed() && this.heldBrick) {
			this.heldBrick.throw(this.flipX ? -1 : 1);
			this.heldBrick = undefined;
		}

		const onGround = this.body.blocked.down;

		// Duck
		if (this.controls.isDownKey() && onGround) {
			if (!this.isDucking) {
				this.isDucking = true;
				this.enterDuck();
			}
		} else if (this.isDucking) {
			this.isDucking = false;
			this.exitDuck();
		}

		if (this.isDucking) return;

		// MOUVEMENT
		const body = this.body as Phaser.Physics.Arcade.Body;

		const isRunning = this.controls.isRunning();
		const targetSpeed = isRunning ? this.maxRunSpeed : this.maxSpeed;

		if (this.controls.isLeft()) {
			const turningBoost = body.velocity.x > 10 ? 1.5 : 1;
			body.setAccelerationX(-this.acceleration * turningBoost);
			this.setFlipX(true);
		} else if (this.controls.isRight()) {
			const turningBoost = body.velocity.x < -10 ? 1.5 : 1;
			body.setAccelerationX(this.acceleration * turningBoost);
			this.setFlipX(false);
		} else {
			const frictionForce = this.deceleration + Math.abs(body.velocity.x) * 1.5;

			if (body.velocity.x > 0) body.setAccelerationX(-frictionForce);
			else if (body.velocity.x < 0) body.setAccelerationX(frictionForce);

			if (Math.abs(body.velocity.x) < 10) {
				body.setAccelerationX(0);
				body.setVelocityX(0);
			}
		}

		// Limite
		if (body.velocity.x > targetSpeed) body.setVelocityX(targetSpeed);
		if (body.velocity.x < -targetSpeed) body.setVelocityX(-targetSpeed);

		// Saut
		if (this.controls.isJumpPressed() && onGround) {
			this.setVelocityY(-this.jumpForce);

			const sc = this.scene as Phaser.Scene & { jumpSound?: { play(): void } };
			sc.jumpSound?.play();
		}

		if (this.heldBrick) {
			this.heldBrick.setPosition(this.x, this.y - 40);
		}

		// ANIMATIONS
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
