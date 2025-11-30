export function createAnimations(scene: Phaser.Scene) {
	const anims = scene.anims;

	// Player
	anims.create({
		key: "player-idle",
		frames: [{ key: "player_idle" }],
		frameRate: 1,
		repeat: -1,
	});
	anims.create({
		key: "player-walk",
		frames: [{ key: "player_walk_a" }, { key: "player_walk_b" }],
		frameRate: 8,
		repeat: -1,
	});
	anims.create({
		key: "player-duck",
		frames: [{ key: "player_duck" }],
		frameRate: 1,
		repeat: -1,
	});
	anims.create({
		key: "player-jump",
		frames: [{ key: "player_jump" }],
		frameRate: 1,
		repeat: 0,
	});
	anims.create({
		key: "player-hit",
		frames: [{ key: "player_hit" }],
		frameRate: 1,
		repeat: 0,
	});

	// Blob
	anims.create({
		key: "blob-walk",
		frames: [{ key: "blob_walk_a" }, { key: "blob_walk_b" }],
		frameRate: 4,
		repeat: -1,
	});

	// Fly
	anims.create({
		key: "fly-walk",
		frames: [{ key: "fly_a" }, { key: "fly_b" }],
		frameRate: 6,
		repeat: -1,
	});

	anims.create({
		key: "fly-rest",
		frames: [{ key: "fly_rest" }],
		frameRate: 1,
		repeat: -1,
	});

	// Worm
	anims.create({
		key: "worm-walk",
		frames: [{ key: "worm_walk_a" }, { key: "worm_walk_b" }],
		frameRate: 4,
		repeat: -1,
	});

	anims.create({
		key: "worm-flat",
		frames: [{ key: "worm_flat" }],
		frameRate: 1,
		repeat: 0,
	});

	// Bee
	anims.create({
		key: "bee-fly",
		frames: [{ key: "bee_a" }, { key: "bee_b" }],
		frameRate: 8,
		repeat: -1,
	});
}
