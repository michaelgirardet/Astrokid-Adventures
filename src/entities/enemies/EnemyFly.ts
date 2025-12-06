import Enemy from "../Enemy";

interface EnemyFlyProps {
	speed?: number;
	patrolMinX?: number;
	patrolMaxX?: number;
}

/**
 * Ennemi "Fly" — vol horizontal simple avec patrouille.
 *
 * @remarks
 * La mouche (Fly) se déplace latéralement entre deux bornes (minX et maxX).
 * Contrairement à la Bee, elle ne possède pas d'oscillation verticale,
 * et son comportement est plus simple et entièrement horizontal.
 *
 * Propriétés Tiled prises en charge :
 * - `speed`: vitesse horizontale
 * - `patrolMinX`: borne gauche
 * - `patrolMaxX`: borne droite
 *
 * @example
 * // Exemple d'objet Tiled :
 * // { "type": "fly", "speed": 120, "patrolMinX": 200, "patrolMaxX": 450 }
 */
export default class EnemyFly extends Enemy {
	/** Vitesse horizontale de la mouche */
	private speed: number;

	/** Borne de patrouille gauche */
	private minX: number;

	/** Borne de patrouille droite */
	private maxX: number;

	/**
	 * @param scene - Scène Phaser où l’ennemi est instancié.
	 * @param x - Position X initiale.
	 * @param y - Position Y initiale.
	 * @param props - Propriétés JSON de Tiled (speed, patrolMinX, patrolMaxX…).
	 */
	constructor(scene: Phaser.Scene, x: number, y: number, props: EnemyFlyProps) {
		super(scene, x, y, "fly_a");

		this.speed = props.speed ?? 100;
		this.minX = props.patrolMinX ?? x - 50;
		this.maxX = props.patrolMaxX ?? x + 50;

		/**
		 * On attend la première frame avant d'appliquer la physique,
		 * pour garantir que le body est initialisé par Phaser.
		 */
		scene.events.once("update", () => {
			const body = this.body as Phaser.Physics.Arcade.Body;

			body.setAllowGravity(false);
			body.setCollideWorldBounds(false);
			body.moves = true;

			// Direction initiale → vers la droite
			body.setVelocityX(this.speed);

			this.anims.play("fly-walk", true);

			// Z-index élevé pour éviter qu’elle soit cachée
			this.setDepth(1000);
		});
	}

	/**
	 * Update exécuté à chaque frame.
	 * Gère uniquement la patrouille horizontale.
	 *
	 * @param _time - Timestamp global du jeu.
	 * @param _delta - Temps depuis la dernière frame.
	 */
	update(_time: number, _delta: number) {
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
	 * Comportement lors de la mort.
	 * - Change d’animation
	 * - Stoppe son déplacement
	 * - Désactive les collisions
	 */
	die() {
		const body = this.body as Phaser.Physics.Arcade.Body;

		this.anims.play("fly-rest", true);

		body.stop();
		body.setVelocity(0, 0);
		body.setAllowGravity(false);
		body.enable = false;

		this.speed = 0;
	}
}
