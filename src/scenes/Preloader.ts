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

		this.load.image("player_idle", "assets/player/character_yellow_idle.png");
		this.load.image("player_jump", "assets/player/character_yellow_jump.png");
		this.load.image(
			"player_walk_a",
			"assets/player/character_yellow_walk_a.png",
		);
		this.load.image(
			"player_walk_b",
			"assets/player/character_yellow_walk_b.png",
		);
		this.load.image("player_hit", "assets/player/character_yellow_hit.png");
		this.load.image("player_duck", "assets/player/character_yellow_duck.png");

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

		this.load.image("worm_idle", "assets/enemies/worm/worm_normal_rest.png");
		this.load.image(
			"worm_walk_a",
			"assets/enemies/worm/worm_normal_move_a.png",
		);
		this.load.image(
			"worm_walk_b",
			"assets/enemies/worm/worm_normal_move_b.png",
		);
		this.load.image("worm_flat", "assets/enemies/worm/worm_normal_rest.png");

		this.load.image("bee_a", "assets/enemies/bee/bee_a.png");
		this.load.image("bee_b", "assets/enemies/bee/bee_b.png");
		this.load.image("bee_rest", "assets/enemies/bee/bee_rest.png");

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
			repeat: -1,
		});
		this.anims.create({
			key: "player-duck",
			frames: [{ key: "player_duck" }],
			frameRate: 1,
			repeat: -1,
		});
		this.anims.create({
			key: "player-jump",
			frames: [{ key: "player_jump" }],
			frameRate: 1,
			repeat: 0,
		});
		this.anims.create({
			key: "player-hit",
			frames: [{ key: "player_hit" }],
			frameRate: 1,
			repeat: 0,
		});

		this.anims.create({
			key: "enemy-idle",
			frames: [{ key: "enemy_idle" }],
			frameRate: 1,
			repeat: 0,
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

		//Worm
		this.anims.create({
			key: "worm-idle",
			frames: [{ key: "worm_idle" }],
			frameRate: 1,
			repeat: -1,
		});

		this.anims.create({
			key: "worm-walk",
			frames: [{ key: "worm_walk_a" }, { key: "worm_walk_b" }],
			frameRate: 4,
			repeat: -1,
		});

		this.anims.create({
			key: "worm-flat",
			frames: [{ key: "worm_flat" }],
			frameRate: 1,
			repeat: 0,
		});

		this.anims.create({
			key: "bee-fly",
			frames: [{ key: "bee_a" }, { key: "bee_b" }],
			frameRate: 8,
			repeat: -1,
		});

		this.anims.create({
			key: "bee-rest",
			frames: [{ key: "bee_rest" }],
			frameRate: 1,
			repeat: -1,
		});

		this.scene.start("Menu");
	}
}
