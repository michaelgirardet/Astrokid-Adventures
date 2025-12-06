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
 * - Appeler la méthode `load()` du niveau pour créer les layers, objets et colliders
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
	 * Charge et initialise le niveau courant.
	 *
	 * @remarks
	 * Pour le MVP, ce loader renvoie toujours le niveau `Forest`.
	 * Dans une version étendue, cette méthode pourrait :
	 * - charger différents niveaux selon la progression du joueur
	 * - lire un fichier JSON de campagne
	 * - récupérer un "levelId" depuis `registry`
	 *
	 * @returns Une instance de `BaseLevel` prête à être utilisée.
	 */
	load(): BaseLevel {
		const level = new Forest(this.scene);
		level.load();
		return level;
	}
}
