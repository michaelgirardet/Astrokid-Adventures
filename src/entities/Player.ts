import Phaser from "phaser";
import InputManager from "../core/InputManager";
import type Brick from "./Bricks";

/**
 * Représente le joueur contrôlable.
 *
 * Gère :
 * - le mouvement (avec inertie façon Mario)
 * - le saut / duck
 * - les collisions / dégâts
 * - le ramassage et le lancer de briques
 * - les animations
 * - l'état d'invincibilité
 *
 * @remarks
 * Cette classe ne connaît pas la logique du niveau ni l’UI :
 * elle gère uniquement la physique et l’animation du personnage.
 */
export default class Player extends Phaser.Physics.Arcade.Sprite {
	private controls: InputManager;

	/** Brique actuellement tenue par le joueur (si existante). */
	heldBrick?: Brick;

	/** Le joueur ne peut pas être touché tant que ce timer n’est pas écoulé. */
	isInvincible = false;
	invincibleTimer = 0;

	/** Désactive temporairement toutes les entrées (ex : mort, fin de niveau). */
	disableControls = false;

	/** Le joueur vient de se faire toucher. */
	isHit = false;

	/** Indique si le joueur est actuellement accroupi. */
	isDucking = false;

	/** Dernière animation jouée (pour éviter les redondances). */
	lastAnim?: string;

	// ---------- Paramètres d’inertie / mouvement ----------
	/** Accélération horizontale (plus haut = plus nerveux). */
	private acceleration = 2000;

	/** Décélération lorsque le joueur relâche les touches. */
	private deceleration = 1200;

	/** Vitesse max en marche simple. */
	private maxSpeed = 200;

	/** Vitesse max en course (touche Shift). */
	private maxRunSpeed = 350;

	/**
	 * Crée une instance du joueur.
	 *
	 * @param scene - Scène Phaser d’attache
	 * @param x - Position X initiale
	 * @param y - Position Y initiale
	 * @param skin - Identifiant du spritesheet (ex : "player1")
	 */
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

		// Hitbox réduite pour des collisions plus naturelles
		this.body.setSize(this.width * 0.6, this.height * 0.9);
		this.body.setOffset(this.width * 0.2, this.height * 0.1);

		this.controls = new InputManager(scene);
	}

	/**
	 * Passe en mode "accroupi" :
	 * réduit la hitbox + joue l'animation.
	 */
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

	/** Sort de l’état accroupi et restaure la hitbox. */
	exitDuck() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		body.setSize(this.width * 0.6, this.height * 0.9);
		body.setOffset(this.width * 0.2, this.height * 0.1);

		this.lastAnim = undefined;
	}

	/**
	 * Logique principale du joueur.
	 * Appelée automatiquement chaque frame par GameScene.
	 */
	update(_time: number, delta: number) {
		if (this.disableControls) return;

		// État touché
		if (this.isHit) {
			this.play("player-hit", true);
			return;
		}

		// Invincibilité temporaire après coup reçu
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

		// Mouvement avec inertie
		const body = this.body as Phaser.Physics.Arcade.Body;

		const isRunning = this.controls.isRunning();
		const targetSpeed = isRunning ? this.maxRunSpeed : this.maxSpeed;

		if (this.controls.isLeft()) {
			// Boost au changement de direction
			const turningBoost = body.velocity.x > 10 ? 1.5 : 1;
			body.setAccelerationX(-this.acceleration * turningBoost);
			this.setFlipX(true);
		} else if (this.controls.isRight()) {
			const turningBoost = body.velocity.x < -10 ? 1.5 : 1;
			body.setAccelerationX(this.acceleration * turningBoost);
			this.setFlipX(false);
		} else {
			// Décélération progressive
			const frictionForce = this.deceleration + Math.abs(body.velocity.x) * 1.5;

			if (body.velocity.x > 0) body.setAccelerationX(-frictionForce);
			else if (body.velocity.x < 0) body.setAccelerationX(frictionForce);

			// Évite les déplacements résiduels
			if (Math.abs(body.velocity.x) < 10) {
				body.setAccelerationX(0);
				body.setVelocityX(0);
			}
		}

		// Limite la vitesse max
		if (body.velocity.x > targetSpeed) body.setVelocityX(targetSpeed);
		if (body.velocity.x < -targetSpeed) body.setVelocityX(-targetSpeed);

		// Saut
		if (this.controls.isJumpPressed() && onGround) {
			this.setVelocityY(-800);

			// Support optionnel du jumpSound
			const sc = this.scene as Phaser.Scene & { jumpSound?: { play(): void } };
			sc.jumpSound?.play();
		}

		// Brique tenue
		if (this.heldBrick) {
			this.heldBrick.setPosition(this.x, this.y - 40);
		}

		// Animations
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
