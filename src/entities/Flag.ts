import Phaser from "phaser";

/**
 * Représente le drapeau de fin de niveau.
 *
 * @remarks
 * Le flag :
 * - est statique (pas de déplacement, pas de gravité)
 * - déclenche la fin du niveau via CollisionManager
 * - possède une hitbox légèrement élargie pour faciliter la détection
 *
 * Cette entité ne gère *aucune logique de fin de niveau* par elle-même :
 * elle ne sert que de trigger. La transition se fait dans CollisionManager.endLevel().
 */

export default class Flag extends Phaser.Physics.Arcade.Sprite {
	/**
	 * @param scene - Scène du jeu dans laquelle placer le drapeau
	 * @param x - Position X
	 * @param y - Position Y (bas du drapeau dans Tiled)
	 */
	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y, "flag");

		scene.add.existing(this);
		scene.physics.add.existing(this);

		const body = this.body as Phaser.Physics.Arcade.Body;

		// Le flag est fixe, il ne tombe pas et ne bouge pas
		body.setAllowGravity(false);
		body.setImmovable(true);

		// Hitbox : tu peux personnaliser selon ton asset
		body.setSize(this.width, this.height);

		// Important : origine en bas gauche pour correspondre au placement Tiled
		this.setOrigin(0, 1);

		// Position finale
		this.setPosition(x, y);
	}
}
