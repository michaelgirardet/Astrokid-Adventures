import Phaser from "phaser";

/**
 * Représente une étoile collectible du niveau.
 *
 * @remarks
 * - L'étoile ne subit pas la gravité et reste statique en physique.
 * - Elle effectue un léger mouvement vertical ("floating") via un tween endless.
 * - Elle est collectée via un overlap géré dans CollisionManager.
 */
export default class Star extends Phaser.Physics.Arcade.Sprite {
	/**
	 * @param scene - Scène Phaser où l'étoile est instanciée
	 * @param x - Position X de l'étoile
	 * @param y - Position Y de l'étoile
	 */
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "Star");

		// Ajout dans la scène
		scene.add.existing(this);
		scene.physics.add.existing(this);

		// Disable physics movement (star floats, not moves)
		const body = this.body as Phaser.Physics.Arcade.Body;
		body.moves = false;
		body.setAllowGravity(false);

		// Tween flottant (effet esthétique)
		scene.tweens.add({
			targets: this,
			y: y - 8,
			duration: 800,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
		});

		// Origine par défaut en haut-gauche
		this.setOrigin(0);

		// Position finale
		this.setPosition(x, y);
	}
}
