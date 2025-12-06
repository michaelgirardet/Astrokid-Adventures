import Enemy from "../Enemy";

/**
 * Ennemi "Worm" — patrouille simple au sol.
 *
 * @remarks
 * Le Worm (ver) se déplace lentement entre deux bornes horizontales.
 * Il ne saute pas, ne vole pas, et dépend totalement de la gravité.
 * Lorsqu'il est écrasé ("squash"), il joue une animation plate avant de disparaître.
 *
 * Propriétés supportées via Tiled :
 * - `speed`: vitesse horizontale
 * - `patrolMinX`: borne gauche
 * - `patrolMaxX`: borne droite
 */
export default class EnemyWorm extends Enemy {
	/** Vitesse de déplacement horizontale */
	private speed: number;

	/** Borne de patrouille gauche */
	private minX: number;

	/** Borne de patrouille droite */
	private maxX: number;

	/**
	 * @param scene - Scène Phaser
	 * @param x - Position X initiale
	 * @param y - Position Y initiale
	 * @param props - Propriétés de Tiled (speed, patrolMinX, patrolMaxX)
	 */
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		props: { speed?: number; patrolMinX?: number; patrolMaxX?: number },
	) {
		super(scene, x, y, "worm_idle");

		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;

			body.setSize(this.width * 0.8, this.height * 0.4);
			body.setOffset(this.width * 0.1, this.height * 0.6);
		});

		this.speed = props.speed ?? 30;
		this.minX = props.patrolMinX ?? x - 40;
		this.maxX = props.patrolMaxX ?? x + 40;

		// --- Hitbox affinée (petite créature au ras du sol)
		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setSize(this.width * 0.8, this.height * 0.35);
		body.setOffset(this.width * 0.1, this.height * 0.65);

		// --- Initialisation physique après la première frame (sécurité Phaser)
		scene.events.once("update", () => {
			body.setAllowGravity(true);
			body.setCollideWorldBounds(true);
			body.moves = true;

			body.setVelocityX(this.speed);
			this.play("worm-walk", true);
		});
	}

	/**
	 * Mise à jour du ver à chaque frame.
	 * Gère uniquement la patrouille horizontale.
	 */
	update() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		if (this.x <= this.minX) {
			body.setVelocityX(this.speed);
			this.flipX = true;
		} else if (this.x >= this.maxX) {
			body.setVelocityX(-this.speed);
			this.flipX = false;
		}
	}

	/**
	 * Animation de "squash" (écrasement).
	 * Utilisé lorsqu'un joueur saute dessus ou qu'un projectile le touche.
	 */
	squash() {
		this.play("worm-flat");

		const body = this.body as Phaser.Physics.Arcade.Body;
		body.enable = false;
		body.stop();
		body.setVelocity(0, 0);

		// Effet visuel d'écrasement + disparition
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			scaleX: 0.6,
			scaleY: 0.4,
			duration: 250,
			onComplete: () => this.destroy(),
		});
	}

	/**
	 * Alias de squash() pour cohérence avec Enemy.
	 */
	die() {
		this.squash();
	}
}
