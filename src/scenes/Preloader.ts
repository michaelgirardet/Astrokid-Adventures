import { createAnimations } from "../core/PreloaderAnimations";
import { loadAssets } from "../core/PreloaderAssets";

/**
 * Scène de préchargement des assets.
 *
 * @description
 * Le Preloader est la toute première scène exécutée :
 * - il charge l’intégralité des assets du jeu (images, sons, tilemaps…),
 * - il initialise les animations globales,
 * - il prépare les valeurs par défaut du registre (ex: son activé/désactivé),
 * - puis redirige immédiatement vers la scène de Menu.
 *
 * @remarks
 * Le préchargement est délégué à deux modules spécialisés :
 * - `loadAssets` : chargement de tous les fichiers nécessaires,
 * - `createAnimations` : création des animations globales (joueur, ennemis, FX…).
 *
 * Cette architecture permet de garder un Preloader minimaliste tout en facilitant
 * la maintenance et l’extension du projet.
 *
 * @see loadAssets
 * @see createAnimations
 */
export class Preloader extends Phaser.Scene {
	constructor() {
		super("Preloader");
	}

	/**
	 * Chargement des assets du jeu.
	 *
	 * @details
	 * Tous les fichiers (images, spritesheets, sons, tilemaps…) sont chargés ici,
	 * afin de garantir que les scènes suivantes disposent de tout ce dont elles ont besoin.
	 *
	 * La logique de chargement est externalisée dans `loadAssets(scene)` pour garder
	 * la scène propre et évolutive.
	 */
	preload() {
		loadAssets(this);
	}

	/**
	 * Initialisation après le chargement :
	 * - création des animations,
	 * - configuration des valeurs du registre,
	 * - transition vers la scène de Menu.
	 */
	create() {
		createAnimations(this);

		// Valeur par défaut : son activé
		this.registry.set("soundMuted", false);

		// Transition immédiate vers le menu principal
		this.scene.start("Menu");
	}
}
