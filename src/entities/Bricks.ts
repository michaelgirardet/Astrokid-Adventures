import Phaser from "phaser";

/**
 * Représente une brique que le joueur peut ramasser, porter
 * et lancer contre les ennemis.
 *
 * Fonctionnalités :
 * - physique arcade complète (gravité, rebond, drag)
 * - être tenue par le joueur
 * - être lancée avec vélocité
 * - perdre de la durabilité (lifespan) après impact
 *
 * @remarks
 * Il existe deux types de briques :
 * - **brown** : 1 point de durabilité
 * - **grey** : 2 points de durabilité
 */
export default class Brick extends Phaser.Physics.Arcade.Sprite {
	/** Indique si la brique est actuellement tenue par le joueur. */
	public isHeld = false;

	/** Référence vers le joueur qui la porte (ou null). */
	public holder: Phaser.Physics.Arcade.Sprite | null = null;

	/** Nombre de coups restants avant destruction. */
	public lifespan: number;

	/**
	 * Empêche le joueur de reprendre immédiatement la brique
	 * juste après un lancer (anti-spam).
	 */
	public canBePicked = true;

	/**
	 * @param scene - Scène Phaser d’attache
	 * @param x - Position X initiale
	 * @param y - Position Y initiale
	 * @param type - Type de brique ("brown" ou "grey"), définit la durabilité
	 */
	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		type: "brown" | "grey",
	) {
		super(scene, x, y, "brick");

		// Ajout au monde
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Durabilité selon le type
		this.lifespan = type === "brown" ? 1 : 2;

		const body = this.body as Phaser.Physics.Arcade.Body;
		body.setCollideWorldBounds(true);
		body.setBounce(0.3, 0.3);
		body.setDrag(200, 0);
		body.setAllowGravity(true);
	}

	/**
	 * Suit la position du joueur lorsqu’elle est tenue.
	 * Appelée automatiquement par Phaser si runChildUpdate = true.
	 */
	update() {
		if (this.isHeld && this.holder) {
			const offsetX = this.holder.flipX ? -20 : 20;
			this.x = this.holder.x + offsetX;
			this.y = this.holder.y - 20;
		}
	}

	/**
	 * Lance la brique dans une direction.
	 *
	 * @param direction - 1 pour droite, -1 pour gauche
	 *
	 * @remarks
	 * - La brique reçoit une vélocité horizontale + un léger saut.
	 * - Elle devient temporairement non-ramassable.
	 */
	throw(direction: number) {
		this.isHeld = false;
		this.holder = null;

		const body = this.body as Phaser.Physics.Arcade.Body;

		this.canBePicked = false;

		body.enable = true;
		body.setAllowGravity(true);

		body.checkCollision.none = false;
		body.checkCollision.up = true;
		body.checkCollision.down = true;
		body.checkCollision.left = true;
		body.checkCollision.right = true;

		this.setImmovable(false);

		body.setVelocity(600 * direction, -200);

		// Retarde la possibilité de récupérer la brique
		this.scene.time.delayedCall(250, () => {
			this.canBePicked = true;
		});
	}

	/**
	 * Inflige un point de dégâts à la brique.
	 * Lorsqu’elle n’a plus de durabilité → destruction.
	 */
	hit() {
		this.lifespan--;

		if (this.lifespan <= 0) {
			this.destroy();
		} else {
			// Feedback visuel
			this.setTint(0xffaaaa);
			this.scene.time.delayedCall(100, () => this.clearTint());
		}
	}
}
