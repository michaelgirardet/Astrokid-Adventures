/**
 * @class LevelLoader
 * @classdesc
 * Responsable du chargement du niveau actif dans le jeu.
 *
 * Ce loader encapsule la logique de sélection et d’instanciation
 * d’un niveau (`BaseLevel`).
 *
 * **Responsabilités :**
 * - Instancier la bonne classe de niveau (Forest, Desert, etc.)
 * - Fournir la clé de la map à charger
 * - Retourner une instance prête à l’emploi pour `GameScene`
 *
 * **Ce que cette classe NE fait pas :**
 * - Ne gère pas la logique du joueur
 * - Ne gère pas les ennemis
 * - Ne gère pas les collisions
 * - Ne gère pas l’UI ou l’audio
 *
 * Elle sert uniquement d’abstraction pour centraliser la logique de loading
 * et permettre l’extension future (sélection de niveau, monde 2, etc.)
 */

import type { BaseLevel } from "../world/BaseLevel";
import Forest from "../world/Forest";

export default class LevelLoader {
	/** Référence à la scène Phaser qui accueillera le niveau. */
	private scene: Phaser.Scene;

	/**
	 * Crée un nouveau LevelLoader.
	 *
	 * @param scene - La scène Phaser dans laquelle le niveau sera créé.
	 */
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	/**
	 * Charge et initialise le niveau demandé.
	 *
	 * @param mapKey - Clé Phaser de la map Tiled à charger.
	 * @remarks
	 * - Si aucune clé n’est fournie, le niveau par défaut est chargé.
	 * - Cette méthode est appelée par `GameScene`.
	 *
	 * @returns Une instance de `BaseLevel` prête à être utilisée.
	 */
	load(mapKey?: string): BaseLevel {
		// Pour l’instant, un seul type de niveau existe : Forest
		// mapKey est transmis au niveau pour qu’il charge la bonne map
		const level = new Forest(this.scene, mapKey);
		level.load();
		return level;
	}
}
