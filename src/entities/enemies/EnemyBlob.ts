import Enemy from "../Enemy";

/**
 * Ennemi "Blob" — plateforme simple avec patrouille horizontale et petits sauts.
 *
 * @remarks
 * Ce type d’ennemi se déplace entre deux bornes (minX et maxX) définies dans Tiled
 * et saute périodiquement. Il peut être écrasé par le joueur (méthode squash).
 *
 * Propriétés Tiled supportées :
 * - `speed` : vitesse horizontale
 * - `patrolMinX` : borne gauche de patrouille
 * - `patrolMaxX` : borne droite de patrouille
 * - `direction` : "left" ou "right"
 *
 * @example
 * // Dans Tiled, un objet "blob" peut avoir :
 * // { "type": "blob", "speed": 60, "patrolMinX": 400, "patrolMaxX": 620 }
 */

export default class EnemyBlob extends Enemy {
	private speed: number;
	private minX: number;
	private maxX: number;

	/** Temps accumulé entre deux sauts aléatoires */
	private jumpTimer = 0;

	/**
	 * @param scene - Scène Phaser où l’ennemi est créé.
	 * @param x - Position X initiale.
	 * @param y - Position Y initiale.
	 * @param props - Propriétés provenant de Tiled (speed, patrolMinX…).
	 */
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		props: {
			speed?: number;
			patrolMinX?: number;
			patrolMaxX?: number;
			direction?: string;
		},
	) {
		super(scene, x, y, "blob_idle");

		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;

			// --- Hitbox spécifique pour le blob ---
			body.setSize(this.width * 0.7, this.height * 0.45);
			body.setOffset(this.width * 0.15, this.height * 0.55);
		});

		// --- Lecture des propriétés ---
		this.speed = props.speed ?? 40;
		this.minX = props.patrolMinX ?? x - 50;
		this.maxX = props.patrolMaxX ?? x + 50;

		/**
		 * On attend le 1er update pour appliquer la physique,
		 * car Phaser n’a pas encore initialisé le body immédiatement après super().
		 */
		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;
			body.setAllowGravity(true);
			body.setCollideWorldBounds(true);

			if (props.direction === "left") {
				body.setVelocityX(-this.speed);
				this.flipX = true;
			} else {
				body.setVelocityX(this.speed);
				this.flipX = false;
			}
		});
	}

	/**
	 * Update exécuté à chaque frame.
	 * Gère :
	 * - la patrouille horizontale (retour aux bornes min/max)
	 * - les sauts aléatoires
	 * - l’animation blob-walk
	 *
	 * @param _time - Temps global du jeu.
	 * @param delta - Temps écoulé depuis la dernière frame.
	 */
	update(_time: number, delta: number) {
		const body = this.body as Phaser.Physics.Arcade.Body;

		// --- PATROUILLE ---
		if (this.x <= this.minX) {
			body.setVelocityX(this.speed);
			this.flipX = true;
		} else if (this.x >= this.maxX) {
			body.setVelocityX(-this.speed);
			this.flipX = false;
		}

		// --- SAUTS ALÉATOIRES ---
		this.jumpTimer += delta;
		const jumpInterval = Phaser.Math.Between(800, 1600);

		if (this.jumpTimer > jumpInterval && body.blocked.down) {
			body.setVelocityY(-200);
			this.jumpTimer = 0;
		}

		// Animation
		this.play("blob-walk", true);
	}

	/**
	 * Animation de "squash" lorsqu’un joueur saute sur le blob.
	 *
	 * @remarks
	 * Le blob est écrasé (sprite aplati), devient immobile,
	 * puis disparaît après un court délai.
	 */
	squash() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		body.setVelocity(0, 0);
		body.enable = false;

		this.setTexture("blob_flat");
		this.setScale(1.1, 0.7);

		body.setSize(this.width * 0.6, this.height * 0.4);
		body.setOffset(this.width * 0.2, this.height * 0.6);

		this.scene.time.delayedCall(250, () => {
			this.destroy();
		});
	}

	/**
	 * Alias de squash pour la méthode générique `die()`
	 * (permet cohérence avec EnemyManager).
	 */
	die() {
		this.squash();
	}
}
