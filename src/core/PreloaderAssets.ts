/**
 * Charge tous les assets du jeu :
 * - Maps Tiled
 * - Tilesets & backgrounds
 * - UI
 * - Joueurs
 * - Ennemis
 * - Items
 * - Sons
 *
 * @remarks
 * Cette fonction est appelée dans la scène Preloader.
 * Elle centralise *toutes* les ressources afin d'avoir un seul point de vérité.
 *
 * Aucun asset ne doit être chargé ailleurs.
 *
 * @param scene - La scène Phaser utilisée pour charger les assets.
 */
export function loadAssets(scene: Phaser.Scene) {
	const load = scene.load;

	// MAPS & TILESETS
	load.tilemapTiledJSON("forest_level", "assets/maps/level_forest.json");

	load.image("Background", "assets/tiles/background_color_trees.png");
	load.image("Tiles", "assets/tiles/tiles.webp");
	load.image("Water", "assets/tiles/water.png");

	load.image("menu_bg", "assets/ui/menubg1.png");

	// UI / HUD
	load.image("heart_full", "assets/ui/heart_full.png");
	load.image("heart_empty", "assets/ui/heart_empty.png");
	load.image("sound_on", "assets/ui/sound_on.png");
	load.image("sound_off", "assets/ui/sound_off.png");

	// PLAYER (Idle, Walk, Jump, Hit, Duck)
	load.image("player1", "assets/player/yellow/character_yellow_idle.png");
	load.image("player2", "assets/player/green/character_green_idle.png");
	load.image("player3", "assets/player/purple/character_purple_idle.png");

	load.image("player_idle", "assets/player/yellow/character_yellow_idle.png");
	load.image("player_jump", "assets/player/yellow/character_yellow_jump.png");

	load.image(
		"player_walk_a",
		"assets/player/yellow/character_yellow_walk_a.png",
	);
	load.image(
		"player_walk_b",
		"assets/player/yellow/character_yellow_walk_b.png",
	);

	load.image("player_hit", "assets/player/yellow/character_yellow_hit.png");
	load.image("player_duck", "assets/player/yellow/character_yellow_duck.png");

	load.image(
		"player_icon",
		"assets/player/yellow/hud_player_helmet_yellow.png",
	);

	// --------------------------------------------------
	// ENEMIES
	// --------------------------------------------------

	// Blob
	load.image("blob_idle", "assets/enemies/blob/slime_normal_rest.png");
	load.image("blob_walk_a", "assets/enemies/blob/slime_normal_walk_a.png");
	load.image("blob_walk_b", "assets/enemies/blob/slime_normal_walk_b.png");
	load.image("blob_flat", "assets/enemies/blob/slime_normal_flat.png");

	// Fly
	load.image("fly_a", "assets/enemies/fly/fly_a.png");
	load.image("fly_b", "assets/enemies/fly/fly_b.png");
	load.image("fly_rest", "assets/enemies/fly/fly_rest.png");

	// Worm
	load.image("worm_idle", "assets/enemies/worm/worm_normal_rest.png");
	load.image("worm_walk_a", "assets/enemies/worm/worm_normal_move_a.png");
	load.image("worm_walk_b", "assets/enemies/worm/worm_normal_move_b.png");
	load.image("worm_flat", "assets/enemies/worm/worm_normal_rest.png");

	// Bee
	load.image("bee_a", "assets/enemies/bee/bee_a.png");
	load.image("bee_b", "assets/enemies/bee/bee_b.png");
	load.image("bee_rest", "assets/enemies/bee/bee_rest.png");

	// ITEMS
	load.image("Coin", "assets/items/gem_yellow.png");
	load.image("Star", "assets/items/star.png");
	load.image("brick", "assets/items/brick.png");
	load.image("flag", "assets/items/flag_red_a.png");

	// SOUNDS
	load.audio("jump_sound", "assets/sounds/effects/sfx_jump.ogg");
	load.audio("hit_sound", "assets/sounds/effects/sfx_hurt.ogg");
	load.audio("disappear_sound", "assets/sounds/effects/sfx_disappear.ogg");

	load.audio("menu_music", "assets/sounds/music/mainTheme.mp3");
	load.audio("level1", "assets/sounds/music/level1.mp3");

	load.audio("coin_sound", "assets/sounds/effects/sfx_coin.ogg");
	load.audio("star_sound", "assets/sounds/effects/sfx_gem.ogg");
	load.audio("level_clear", "assets/sounds/effects/sfx_victory.mp3");
}
