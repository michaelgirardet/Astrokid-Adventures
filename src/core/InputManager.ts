/**
 * @class InputManager
 * @classdesc
 * Gestion centralisée des entrées clavier pour le joueur.
 *
 * Fournit une interface simple et unifiée permettant :
 * - de supporter plusieurs layouts (AZERTY, QWERTY)
 * - de regrouper plusieurs touches sous une même action
 * - d'abstraire Phaser.Input pour un Player plus propre
 *
 * @remarks
 * Le Player ne dépend plus directement de Phaser.Keyboard,
 * ce qui améliore la lisibilité, la testabilité et la maintenabilité.
 */

import Phaser from "phaser";

export default class InputManager {
	private scene: Phaser.Scene;

	/**
	 * Stockage interne des touches mappées selon leur action.
	 *
	 * Exemple :
	 * - "left" → [LEFT, A, Q]
	 * - "jump" → [UP, W, Z]
	 */

	private keys: Record<string, Phaser.Input.Keyboard.Key[]> = {};

	constructor(scene: Phaser.Scene) {
		this.scene = scene;

		const k = Phaser.Input.Keyboard.KeyCodes;

		/**
		 * Définition centralisée des touches par action.
		 * Cette structure facilite grandement la maintenance.
		 */
		this.keys = {
			left: [
				scene.input.keyboard.addKey(k.LEFT),
				scene.input.keyboard.addKey(k.A),
				scene.input.keyboard.addKey(k.Q),
			],
			right: [
				scene.input.keyboard.addKey(k.RIGHT),
				scene.input.keyboard.addKey(k.D),
			],
			up: [
				scene.input.keyboard.addKey(k.UP),
				scene.input.keyboard.addKey(k.W),
				scene.input.keyboard.addKey(k.Z), // ZQSD
			],
			down: [
				scene.input.keyboard.addKey(k.DOWN),
				scene.input.keyboard.addKey(k.S),
			],
			run: [scene.input.keyboard.addKey(k.SHIFT)],
			action: [scene.input.keyboard.addKey(k.SPACE)],
		};
	}

	/**
	 * Vérifie si l’une des touches d'une action est enfoncée.
	 *
	 * @param action - Nom de l’action (left, right, up…)
	 */
	private isDown(action: keyof InputManager["keys"]): boolean {
		return this.keys[action].some((key) => key.isDown);
	}

	/**
	 * Vérifie si l’une des touches d'une action vient d’être pressée
	 * (JustDown).
	 *
	 * @param action - Nom de l’action
	 */
	private isPressed(action: keyof InputManager["keys"]): boolean {
		return this.keys[action].some((key) => Phaser.Input.Keyboard.JustDown(key));
	}

	/** @returns true si le joueur va vers la gauche */
	isLeft(): boolean {
		return this.isDown("left");
	}

	/** @returns true si le joueur va vers la droite */
	isRight(): boolean {
		return this.isDown("right");
	}

	/** @returns true si le joueur appuie sur bas */
	isDownKey(): boolean {
		return this.isDown("down");
	}

	/** @returns true si le joueur tente de sauter */
	isJumpPressed(): boolean {
		return this.isPressed("up");
	}

	/** @returns true si le joueur tente d’utiliser l'action (lancer, interagir...) */
	isActionPressed(): boolean {
		return this.isPressed("action");
	}

	/** @returns true si SHIFT est maintenu → courir */
	isRunning(): boolean {
		return this.isDown("run");
	}
}
