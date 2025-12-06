/**
 * @function createAnimations
 * @description
 * Déclare toutes les animations du jeu dans l'AnimationManager de Phaser.
 *
 * Cette fonction centralise :
 * - les animations du joueur
 * - celles des ennemis (Blob, Fly, Worm, Bee)
 *
 * @remarks
 * Les animations sont enregistrées une fois au démarrage (Preloader),
 * puis réutilisées dans toutes les scènes.
 *
 * La fonction ignore automatiquement les animations déjà existantes
 * pour éviter les erreurs lorsque la scène est recréée.
 *
 * @param scene - La scène Phaser depuis laquelle les animations sont enregistrées.
 */

export function createAnimations(scene: Phaser.Scene) {
	const anims = scene.anims;

	/**
	 * Petite fonction utilitaire permettant :
	 * - de ne créer une animation que si elle n'existe pas déjà
	 * - de réduire la répétition dans le fichier
	 */
	const add = (
		key: string,
		frames: { key: string }[],
		frameRate: number,
		repeat: number | -1 = -1,
	) => {
		if (anims.exists(key)) return; // évite les duplicatas

		anims.create({
			key,
			frames,
			frameRate,
			repeat,
		});
	};

	// PLAYER
	add("player-idle", [{ key: "player_idle" }], 1, -1);

	add(
		"player-walk",
		[{ key: "player_walk_a" }, { key: "player_walk_b" }],
		8,
		-1,
	);

	add("player-duck", [{ key: "player_duck" }], 1, -1);

	add("player-jump", [{ key: "player_jump" }], 1, 0);

	add("player-hit", [{ key: "player_hit" }], 1, 0);

	// ENEMIES

	// Blob
	add("blob-walk", [{ key: "blob_walk_a" }, { key: "blob_walk_b" }], 4, -1);

	// Fly
	add("fly-walk", [{ key: "fly_a" }, { key: "fly_b" }], 6, -1);

	add("fly-rest", [{ key: "fly_rest" }], 1, -1);

	// Worm
	add("worm-walk", [{ key: "worm_walk_a" }, { key: "worm_walk_b" }], 4, -1);

	add("worm-flat", [{ key: "worm_flat" }], 1, 0);

	// Bee
	add("bee-fly", [{ key: "bee_a" }, { key: "bee_b" }], 8, -1);
}
