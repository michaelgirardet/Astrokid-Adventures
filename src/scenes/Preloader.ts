export class Preloader extends Phaser.Scene {
	constructor() {
		super("Preloader");
	}

	preload() {
		const font = new FontFace("DynaPuff", `url("fonts/DynaPuff.ttf")`);

		font.load().then((loaded) => {
			document.fonts.add(loaded);
		});

		this.load.image(
			"Background",
			"assets/tiles/background_fade_mushrooms.webp",
		);
		this.load.image("Tiles", "assets/tiles/tiles.webp");
		this.load.image("Enemies", "assets/tiles/enemies.webp");
		this.load.image("Player", "assets/tiles/player.webp");

		this.load.tilemapTiledJSON("level1", "assets/level1.json");
		this.load.image("menu_bg", "assets/ui/background_echo_jump.png");

		// Musics
		this.load.audio("menu_music", "assets/sounds/music/menu-audio.mp3");
		this.load.audio("game_music", "assets/sounds/music/level1.mp3");

		//Sounds
		this.load.audio("hit_sound", "assets/sounds/effects/sfx_hurt.ogg");
		this.load.audio("jump_sound", "assets/sounds/effects/sfx_jump.ogg");
		this.load.audio(
			"disappear_sound",
			"assets/sounds/effects/sfx_disappear.ogg",
		);
		this.load.audio("coin_sound", "assets/sounds/effects/sfx_coin.ogg");
		this.load.audio("star_sound", "assets/sounds/effects/sfx_gem.ogg");
		this.load.audio("level_clear", "assets/sounds/effects/sfx_victory.mp3");

		this.load.image("heart_full", "assets/ui/heart_full.png");
		this.load.image("heart_empty", "assets/ui/heart_empty.png");

		this.load.image("player_idle", "assets/player/character_pink_idle.webp");
		this.load.image("player_jump", "assets/player/character_pink_jump.webp");
		this.load.image("player_walk_a", "assets/player/character_pink_walk_a.png");
		this.load.image("player_walk_b", "assets/player/character_pink_walk_b.png");
		this.load.image("player_hit", "assets/player/character_pink_hit.png");

		this.load.image("enemy_idle", "assets/enemy_idle.png");
		this.load.image("blob_idle", "assets/enemies/blob/slime_normal_rest.png");
		this.load.image(
			"blob_walk_a",
			"assets/enemies/blob/slime_normal_walk_a.png",
		);
		this.load.image(
			"blob_walk_b",
			"assets/enemies/blob/slime_normal_walk_b.png",
		);
		this.load.image("blob_flat", "assets/enemies/blob/slime_normal_flat.png");

		this.load.image("fly_a", "assets/enemies/fly/fly_a.png");
		this.load.image("fly_b", "assets/enemies/fly/fly_b.png");
		this.load.image("fly_rest", "assets/enemies/fly/fly_rest.png");

		this.load.image("flag", "assets/items/flag_yellow_a.png");
		this.load.image("brick", "assets/items/brick.png");

		this.load.image("Ground", "assets/ground.png");
		this.load.image("Block", "assets/block.png");
		this.load.image("Coin", "assets/items/gem_green.png");
		this.load.image("Star", "assets/items/star.png");
	}

	// Animations
	create() {
		this.anims.create({
			key: "player-idle",
			frames: [{ key: "player_idle" }],
			frameRate: 1,
			repeat: -1,
		});
		this.anims.create({
			key: "player-walk",
			frames: [{ key: "player_walk_a" }, { key: "player_walk_b" }],
			frameRate: 8,
		});
		this.anims.create({
			key: "player-jump",
			frames: [{ key: "player_jump" }],
			frameRate: 1,
			repeat: -1,
		});
		this.anims.create({
			key: "player-hit",
			frames: [{ key: "player_hit" }],
			frameRate: 1,
			repeat: -1,
		});

		this.anims.create({
			key: "enemy-idle",
			frames: [{ key: "enemy_idle" }],
			frameRate: 1,
			repeat: -1,
		});
		this.anims.create({
			key: "blob-walk",
			frames: [{ key: "blob_walk_a" }, { key: "blob_walk_b" }],
			frameRate: 4,
			repeat: -1,
		});
		this.anims.create({
			key: "fly-walk",
			frames: [{ key: "fly_a" }, { key: "fly_b" }],
			frameRate: 6,
			repeat: -1,
		});
		this.anims.create({
			key: "fly-rest",
			frames: [{ key: "fly_rest" }],
			frameRate: 1,
			repeat: -1,
		});

		this.scene.start("Menu");
	}
}
