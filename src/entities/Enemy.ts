import Phaser from "phaser";

/**
 * Classe de base abstraite pour tous les ennemis du jeu.
 *
 * @remarks
 * Cette classe fournit :
 * - une intégration Phaser Arcade (sprite + physics)
 * - une structure commune pour `update()`
 * - des méthodes génériques de destruction (`die`, `squash`)
 *
 * Chaque ennemi spécifique (Blob, Fly, Bee, Worm…) étend cette classe
 * et implémente sa logique propre : déplacement, animations, IA.
 *
 * @example
 * class EnemyBlob extends Enemy {
 *   update(time, delta) {
 *     // déplacement horizontal...
 *   }
 * }
 */
export default abstract class Enemy extends Phaser.Physics.Arcade.Sprite {
	/**
	 * Crée un ennemi générique.
	 *
	 * @param scene - Scène Phaser où l'ennemi est instancié.
	 * @param x - Position X initiale.
	 * @param y - Position Y initiale.
	 * @param texture - Clé de texture Phaser pour ce sprite.
	 */
	constructor(scene: Phaser.Scene, x: number, y: number, texture: string) {
		super(scene, x, y, texture);

		// Ajout à la scène + activation physique
		scene.add.existing(this);
		scene.physics.add.existing(this);

		this.setImmovable(false);
	}

	/**
	 * Méthode d’update obligatoire pour tous les ennemis.
	 * Doit être implémentée dans les classes enfants.
	 *
	 * @param time - Temps global du jeu.
	 * @param delta - Temps écoulé depuis le dernier frame.
	 */
	abstract update(time: number, delta: number): void;

	/**
	 * Détruit immédiatement l’ennemi.
	 *
	 * @remarks
	 * Peut être surchargée par des ennemis ayant une animation de mort.
	 */
	die() {
		this.destroy();
	}

	/**
	 * Appelée lorsqu’un ennemi est écrasé par le joueur (Mario-style).
	 *
	 * @remarks
	 * Dans les classes enfants, cette méthode peut jouer :
	 * - une animation de squash
	 * - un son
	 * - un effet de particule
	 */
	squash() {
		this.destroy();
	}
}
