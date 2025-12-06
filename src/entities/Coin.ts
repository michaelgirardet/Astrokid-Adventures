import Phaser from "phaser";

/**
 * Représente une pièce collectible dans le niveau.
 *
 * @remarks
 * La pièce :
 * - est statique (pas de gravité, pas de déplacement)
 * - utilise un hitbox circulaire
 * - disparaît lorsqu'elle est collectée via CollisionManager
 *
 * Elle ne gère pas elle-même sa collecte : c’est CollisionManager qui détruit
 * l’objet et applique score + son.
 */

export default class Coin extends Phaser.Physics.Arcade.Sprite {
	/**
	 * @param scene - Scène Phaser parent
	 * @param x - Position X
	 * @param y - Position Y
	 */
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "Coin");

		// Ajout à la scène + activation physique
		scene.add.existing(this);
		scene.physics.add.existing(this);

		const body = this.body as Phaser.Physics.Arcade.Body;

		// Les coins ne bougent pas
		body.moves = false;
		body.setAllowGravity(false);

		// Hitbox circulaire (meilleur feeling)
		const radius = 10;
		this.setCircle(radius, this.width / 2 - radius, this.height / 2 - radius);
		this.setOrigin(0.5, 0.5);

		// Facultatif : petit idle animation (léger rebond)
		this.scene.tweens.add({
			targets: this,
			y: this.y - 4,
			duration: 700,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});
	}
}
