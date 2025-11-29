import { Level } from "../world/Level";
import Player from "../entities/Player";
import Star from "../entities/Star";
import type ScoreUI from "../ui/ScoreUI";
import EnemyFly from "../entities/enemies/EnemyFly";
import EnemyBlob from "../entities/enemies/EnemyBlob";
import type HeartUI from "../ui/HeartUI";
import HUD from "../ui/HUD";
import type StarUI from "../ui/StarUI";
import type Brick from "../entities/Bricks";
import type Enemy from "../entities/Enemy";
import type Coin from "../entities/Coin";
import type Flag from "../entities/Flag";

export default class GameScene extends Phaser.Scene {
	private level!: Level;
	private player!: Player;
	private stars!: Phaser.Physics.Arcade.Group;
	private bombs!: Phaser.Physics.Arcade.Group;
	private scoreUI!: ScoreUI;
	private heartUI!: HeartUI;
	private starUI!: StarUI;
	private hud!: HUD;
	private gameMusic!: Phaser.Sound.BaseSound;
	private hitSound!: Phaser.Sound.BaseSound;
	private jumpSound!: Phaser.Sound.BaseSound;
	private disappearSound!: Phaser.Sound.BaseSound;
	private coinSound!: Phaser.Sound.BaseSound;
	private starSound!: Phaser.Sound.BaseSound;
	private levelClear!: Phaser.Sound.BaseSound;
	private brickPickupOverlap!: Phaser.Physics.Arcade.Collider;
	// private playerBrickCollider!: Phaser.Physics.Arcade.Collider;
	private levelEnding = false;

	constructor() {
		super("Game");
	}

	create() {
		this.levelEnding = false;
		this.level = new Level(this);
		this.level.load();
		this.physics.world.TILE_BIAS = 60;
		this.hud = new HUD(this);
		this.starUI = this.hud.getStars();
		this.heartUI = this.hud.getHearts();
		this.scoreUI = this.hud.getScore();
		this.gameMusic = this.sound.add("game_music", {
			volume: 0,
			loop: true,
		});
		this.gameMusic.play();

		this.hitSound = this.sound.add("hit_sound", { volume: 0.2 });
		this.jumpSound = this.sound.add("jump_sound", { volume: 0.2 });
		this.disappearSound = this.sound.add("disappear_sound", { volume: 0.2 });
		this.coinSound = this.sound.add("coin_sound", { volume: 0.2 });
		this.starSound = this.sound.add("star_sound", { volume: 0.2 });
		this.levelClear = this.sound.add("level_clear", { volume: 0.2 });

		// Pause
		this.input.keyboard.on("keydown-ESC", () => {
			this.scene.launch("Pause");
			this.scene.pause();
		});

		// Player
		const spawn = this.level.map.findObject(
			"Objects_Player",
			(obj) => obj.name === "Player",
		);
		this.player = new Player(this, spawn.x, spawn.y);

		// Zones vides
		this.level.voidZones.forEach((zone) => {
			this.physics.add.overlap(
				this.player,
				zone,
				this.fallToDeath,
				undefined,
				this,
			);
		});

		// Ennemis
		const enemyObjects = this.level.map.getObjectLayer("Enemies").objects;

		enemyObjects.forEach((obj) => {
			const props: any = {};
			obj.properties?.forEach((p: any) => {
				props[p.name] = p.value;
			});

			let enemy: Enemy;

			if (props.type === "fly") {
				enemy = new EnemyFly(this, obj.x, obj.y, props);
			} else if (props.type === "blob") {
				enemy = new EnemyBlob(this, obj.x, obj.y - (obj.height || 32), props);
			} else {
				console.warn("Unknown enemy type:", props.type);
				return;
			}

			enemy.setDepth(10);

			this.level.enemies.add(enemy);
		});

		// Etoiles
		this.stars = this.physics.add.group();
		const starObjects = this.level.map.getObjectLayer("Stars").objects;
		starObjects.forEach((obj) => {
			this.stars.add(new Star(this, obj.x, obj.y));
		});

		// Collisions et Overlaps
		this.physics.add.collider(this.player, this.level.groundLayer);
		this.physics.add.collider(this.player, this.level.blocksLayer);
		this.physics.add.collider(
			this.player,
			this.level.enemies,
			this.hitEnemy,
			undefined,
			this,
		);
		// Only blobs collide with ground / blocks
		this.physics.add.collider(
			this.level.enemies.getChildren().filter((e) => e instanceof EnemyBlob),
			this.level.groundLayer,
		);

		this.physics.add.collider(
			this.level.enemies.getChildren().filter((e) => e instanceof EnemyBlob),
			this.level.blocksLayer,
		);
		this.physics.add.overlap(
			this.player,
			this.level.enemies,
			this.hitEnemyFromAbove,
			this.checkIfAbove,
			this,
		);
		this.physics.add.overlap(
			this.player,
			this.level.coins,
			this.collectCoin,
			undefined,
			this,
		);
		this.physics.add.overlap(
			this.player,
			this.stars,
			this.collectStar,
			undefined,
			this,
		);

		// Drapeau
		this.physics.add.overlap(
			this.player,
			this.level.flag,
			this.endLevel,
			undefined,
			this,
		);

		// this.playerBrickCollider = this.physics.add.collider(
		// 	this.player,
		// 	this.level.bricks,
		// );

		// Ramasser une brique
		this.brickPickupOverlap = this.physics.add.overlap(
			this.player,
			this.level.bricks,
			this.pickBrick,
			undefined,
			this,
		);
		// Brique touche un ennemi
		this.physics.add.collider(
			this.level.bricks,
			this.level.enemies,
			this.brickHitEnemy,
			undefined,
			this,
		);
		this.physics.add.collider(this.level.bricks, this.level.groundLayer);
		this.physics.add.collider(this.level.bricks, this.level.blocksLayer);

		// Caméra
		this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
		this.cameras.main.setBounds(
			0,
			0,
			this.level.map.widthInPixels,
			this.level.map.heightInPixels,
		);
	}

	update(time: number, delta: number) {
		this.player.update(time, delta);

		this.level.enemies.children.each((enemy: Enemy) => {
			if (enemy.update) {
				enemy.update(time, delta);
			}
		});
	}

	spawnStars() {
		for (let i = 0; i < 12; i++) {
			const star = new Star(this, 12 + i * 70, 0);
			this.stars.add(star);
		}
	}
	collectStar(_player: Player, star: Star) {
		star.disableBody(true, true);
		this.starUI.addStar();
		this.starSound.play();
		this.scoreUI.add(1000);
	}

	collectCoin(_player: Player, coin: Coin) {
		coin.destroy();
		this.scoreUI.add(100);
		this.coinSound.play();
	}

	checkIfAbove(player, enemy) {
		const bodyP = player.body;
		const bodyE = enemy.body;

		const comingDownFast = bodyP.velocity.y > 100;

		const playerBottom = bodyP.bottom;
		const enemyTop = bodyE.top;

		return comingDownFast && playerBottom < enemyTop + 20;
	}

	hitEnemyFromAbove(player: Player, enemy: Enemy) {
		const enemyAny = enemy as any;
		if (typeof enemyAny.squash === "function") {
			enemyAny.squash();
		} else {
			enemy.destroy();
		}

		this.disappearSound.play();

		player.body.checkCollision.none = true;
		this.time.delayedCall(120, () => {
			player.body.checkCollision.none = false;
		});

		player.setVelocityY(-500);
	}

	hitEnemy(_player: Player, _enemy: Enemy) {
		if (this.player.body.velocity.y > 0) return;
		if (this.player.isInvincible) return;

		this.hitSound.play();

		this.player.isHit = true;
		this.player.play("player-hit");

		// Invincibilité
		this.player.isInvincible = true;
		this.player.invincibleTimer = 1000;
		this.player.setTint(0xff5555);
		this.player.setAlpha(0.5);

		this.heartUI.loseHeart();

		// Reset HIT state après 250 ms
		this.time.delayedCall(250, () => {
			this.player.isHit = false;
		});

		if (this.heartUI.getHearts() <= 0) {
			console.log("GAME OVER");
			this.scene.restart();
			this.gameMusic.stop();
		}
	}

	pickBrick(player: Player, brick: Brick) {
		console.log("🤏 pickBrick CALLED");

		// 🔹 1. Le joueur a déjà une brique
		if (player.heldBrick) {
			console.warn("⚠️ Player already holding a brick.");
			return;
		}

		// 🔹 2. La brique vient d’être lancée → on ignore
		if (!brick.canBePicked) {
			console.warn("⏳ Brick not pickable yet.");
			return;
		}

		// 🔹 3. La brique est déjà marquée comme tenue
		if (brick.isHeld) {
			console.warn("⚠️ Brick already held.");
			return;
		}

		brick.isHeld = true;
		brick.holder = player;
		player.heldBrick = brick;

		const body = brick.body as Phaser.Physics.Arcade.Body;
		body.setAllowGravity(false);
		body.setVelocity(0, 0);
		body.checkCollision.none = true;
		brick.setImmovable(true);

		console.log("📦 Brick picked!");
	}

	brickHitEnemy(
		brickObj: Phaser.GameObjects.GameObject,
		enemyObj: Phaser.GameObjects.GameObject,
	) {
		const brick = brickObj as Brick;
		const enemy = enemyObj as Enemy;

		console.log("💥 brickHitEnemy CALLED");

		// Garde-fou : vérifier que c'est bien un Brick avec la méthode hit
		if (typeof (brick as any).hit !== "function") {
			console.warn("❌ brick.hit is not a function, skipping collision");
			return;
		}

		if (brick.isHeld) {
			console.warn("❌ Brick is still held → ignoring collision");
			return;
		}

		const body = brick.body as Phaser.Physics.Arcade.Body;
		const speed = Math.abs(body.velocity.x) + Math.abs(body.velocity.y);

		console.log("🧱 Brick speed =", speed);

		if (speed < 80) {
			console.warn("⚠️ Speed too low, no damage");
			return;
		}

		console.log("🔥 Brick should DAMAGE enemy now");

		const enemyAny = enemy as any;

		if (typeof enemyAny.squash === "function") {
			console.log("🪓 Enemy has squash(), calling it…");
			enemyAny.squash();
		} else {
			console.log("💀 Enemy destroyed()");
			enemy.destroy();
		}

		brick.hit();
		this.disappearSound.play();
		this.scoreUI.add(200);

		console.log("🧱 Brick lifespan now:", brick.lifespan);
	}

	fallToDeath() {
		if (this.levelEnding) return;
		this.levelEnding = true;

		// Désactiver les contrôles
		this.player.disableControls = true;

		// Faire disparaître le joueur
		this.tweens.add({
			targets: this.player,
			alpha: 0,
			duration: 300,
		});

		// Enlever toutes les vies
		this.heartUI.setHearts(0);

		// Stop musique
		this.gameMusic.stop();

		// Restart du niveau après un petit délai
		this.time.delayedCall(500, () => {
			this.scene.restart();
		});
	}

	// Fin de niveau
	endLevel(player: Player, flag: Flag) {
		if (this.levelEnding) return;
		this.levelEnding = true;

		// Bloquer les contrôles
		player.setVelocity(0, 0);
		(player.body as Phaser.Physics.Arcade.Body).allowGravity = false;
		player.disableControls = true;

		// Descente du drapeau
		this.tweens.add({
			targets: player,
			y: flag.y + flag.height - player.height,
			duration: 800,
			ease: "Linear",
			onComplete: () => {
				// Remettre la gravité
				(player.body as Phaser.Physics.Arcade.Body).allowGravity = true;
				player.setFlipX(false);

				// Marche automatique
				this.time.delayedCall(200, () => {
					player.setVelocityX(160);
				});

				// Fade-out
				this.cameras.main.fadeOut(1200, 0, 0, 0);

				this.time.delayedCall(1500, () => {
					this.scene.start("Victory");
				});
			},
		});

		// Musique fin
		this.gameMusic.stop();
		this.sound.play("level_clear");
	}
}
