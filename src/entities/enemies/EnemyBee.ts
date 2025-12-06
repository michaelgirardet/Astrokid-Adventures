import Enemy from "../Enemy";

/**
 * Ennemi "Bee" — vol horizontal avec oscillation (buzz) et zigzag vertical.
 *
 * @remarks
 * La Bee est un ennemi volant qui :
 * - se déplace entre deux bornes horizontales (minX / maxX)
 * - oscille légèrement (buzz)
 * - effectue un mouvement sinusoïdal vertical (zigzag)
 * - n’est pas affectée par la gravité
 *
 * Propriétés Tiled prises en charge :
 * - `speed` : vitesse horizontale
 * - `patrolMinX` : borne gauche
 * - `patrolMaxX` : borne droite
 * - `direction` : "left" ou "right"
 *
 * @example
 * // Exemple d'objet Tiled :
 * // { "type": "bee", "speed": 90, "direction": "left", "patrolMinX": 300, "patrolMaxX": 520 }
 */
export default class EnemyBee extends Enemy {
	private speed: number;
	private minX: number;
	private maxX: number;

	/** Timer interne utilisé pour le mouvement oscillatoire (buzz + zigzag) */
	private buzzTimer = 0;

	/**
	 * @param scene - Scène Phaser où l’ennemi est instancié.
	 * @param x - Position X initiale.
	 * @param y - Position Y initiale.
	 * @param props - Propriétés fournies par Tiled (speed, direction, patrol…).
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
		super(scene, x, y, "bee_a");

		this.speed = props.speed ?? 80;
		this.minX = props.patrolMinX ?? x - 60;
		this.maxX = props.patrolMaxX ?? x + 60;

		/**
		 * On attend la première frame pour appliquer la physique,
		 * car Phaser ne garantit pas un body entièrement prêt immédiatement.
		 */
		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;

			body.setAllowGravity(false); // La bee ne tombe pas
			body.moves = true;

			// Direction initiale
			const dir = props.direction === "left" ? -1 : 1;
			body.setVelocityX(dir * this.speed);

			this.flipX = props.direction === "left";

			// Animation d'aile
			this.play("bee-fly", true);
		});
	}

	/**
	 * Update exécuté à chaque frame.
	 * Gère :
	 * - la patrouille horizontale
	 * - le mouvement oscillatoire (buzz)
	 * - le zigzag vertical
	 *
	 * @param _time - Horloge globale du jeu.
	 * @param delta - Temps écoulé depuis la dernière frame.
	 */
	update(_time: number, delta: number) {
		const body = this.body as Phaser.Physics.Arcade.Body;

		// PATROUILLE HORIZONTALE
		if (this.x <= this.minX) {
			body.setVelocityX(this.speed);
			this.flipX = true;
		} else if (this.x >= this.maxX) {
			body.setVelocityX(-this.speed);
			this.flipX = false;
		}

		// OSCILLATION
		this.buzzTimer += delta;
		this.y += Math.sin(this.buzzTimer * 0.005) * 0.4;

		// ZIGZAG VERTICAL
		const zigzagAmp = 6;
		const zigzagSpeed = 0.003;

		this.y +=
			Math.sin(this.buzzTimer * zigzagSpeed) * (zigzagAmp * delta * 0.01);
	}

	/**
	 * Comportement lorsqu'elle meurt :
	 * - tombe au sol
	 * - devient semi-transparente
	 * - disparaît après une courte animation
	 */
	die() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		body.setVelocity(0, 0);
		body.setAllowGravity(true);
		body.enable = false;

		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: 400,
			onComplete: () => {
				this.destroy();
			},
		});
	}
}
