import type { BaseLevel } from "../world/BaseLevel";
import type Player from "../entities/Player";
import type Brick from "../entities/Bricks";
import type Enemy from "../entities/Enemy";
import type Coin from "../entities/Coin";
import type Star from "../entities/Star";
import type Flag from "../entities/Flag";
import type UIManager from "./UIManager";
import type SoundManager from "./SoundManager";

export default class CollisionManager {
	private scene: Phaser.Scene;
	private player: Player;
	private level: BaseLevel;
	private stars: Phaser.Physics.Arcade.Group;
	private ui: UIManager;
	private sound: SoundManager;
	private levelEnding = false;

	constructor(
		scene: Phaser.Scene,
		player: Player,
		level: BaseLevel,
		stars: Phaser.Physics.Arcade.Group,
		ui: UIManager,
		sound: SoundManager,
	) {
		this.scene = scene;
		this.player = player;
		this.level = level;
		this.stars = stars;
		this.ui = ui;
		this.sound = sound;
	}

	setup() {
		const physics = this.scene.physics;

		// --- Player / environnement ---
		physics.add.collider(this.player, this.level.groundLayer);
		physics.add.collider(this.player, this.level.blocksLayer);

		// --- Player / ennemis ---
		physics.add.collider(
			this.player,
			this.level.enemies,
			this.hitEnemy,
			undefined,
			this,
		);

		physics.add.overlap(
			this.player,
			this.level.enemies,
			this.hitEnemyFromAbove,
			this.checkIfAbove,
			this,
		);

		// --- Player / coins ---
		physics.add.overlap(
			this.player,
			this.level.coins,
			this.collectCoin,
			undefined,
			this,
		);

		// --- Player / stars ---
		physics.add.overlap(
			this.player,
			this.stars,
			this.collectStar,
			undefined,
			this,
		);

		// --- Player / flag ---
		physics.add.overlap(
			this.player,
			this.level.flag,
			this.endLevel,
			undefined,
			this,
		);

		// --- Player / void ---
		this.level.voidZones.forEach((zone) => {
			physics.add.overlap(this.player, zone, this.fallToDeath, undefined, this);
		});

		// --- Ennemis / void ---
		this.level.voidZones.forEach((zone) => {
			physics.add.overlap(
				zone,
				this.level.enemies,
				this.enemyFallToDeath,
				undefined,
				this,
			);
		});

		// --- Bricks / player & ennemis ---
		physics.add.overlap(
			this.player,
			this.level.bricks,
			this.pickBrick,
			undefined,
			this,
		);

		physics.add.collider(
			this.level.bricks,
			this.level.enemies,
			this.brickHitEnemy,
			undefined,
			this,
		);

		physics.add.collider(this.level.bricks, this.level.groundLayer);
		physics.add.collider(this.level.bricks, this.level.blocksLayer);
	}

	// ---------- Collectes ----------

	private collectStar(_player: Player, star: Star) {
		star.disableBody(true, true);
		this.ui.stars.addStar();
		this.sound.playSfx("star_sound");
		this.ui.score.add(1000);
	}

	private collectCoin(_player: Player, coin: Coin) {
		coin.destroy();
		this.ui.score.add(100);
		this.sound.playSfx("coin_sound");
	}

	// ---------- Ennemis / Player ----------

	private checkIfAbove(player: Player, enemy: Enemy): boolean {
		const pb = player.body as Phaser.Physics.Arcade.Body;
		const eb = enemy.body as Phaser.Physics.Arcade.Body;

		return (
			pb.velocity.y > 0 &&
			pb.bottom > eb.top &&
			pb.bottom - pb.velocity.y <= eb.top
		);
	}

	private hitEnemyFromAbove(player: Player, enemy: Enemy) {
		const enemyAny = enemy as Enemy & { squash?: () => void };

		if (enemyAny.squash) {
			enemyAny.squash();
		} else {
			enemy.destroy();
		}

		this.sound.playSfx("disappear_sound");

		player.body.checkCollision.none = true;
		this.scene.time.delayedCall(120, () => {
			player.body.checkCollision.none = false;
		});

		player.setVelocityY(-350);
	}

	private hitEnemy(player: Player, enemy: Enemy) {
		const bodyP = player.body as Phaser.Physics.Arcade.Body;
		const bodyE = enemy.body as Phaser.Physics.Arcade.Body;

		const playerBottom = bodyP.bottom;
		const enemyTop = bodyE.top;
		const comingDownFast = bodyP.velocity.y > 150;

		const isAbove = playerBottom < enemyTop + 10 && comingDownFast;

		if (isAbove) {
			const enemyAny = enemy as Enemy & { squash?: () => void };
			if (enemyAny.squash) enemyAny.squash();
			else enemy.destroy();

			this.sound.playSfx("disappear_sound");
			player.setVelocityY(-500);
			return;
		}

		// Dégâts joueur
		if (player.isInvincible) return;

		this.sound.playSfx("hit_sound");

		player.isHit = true;
		player.play("player-hit");

		player.isInvincible = true;
		player.invincibleTimer = 1000;
		player.setTint(0xff5555);
		player.setAlpha(0.5);

		this.ui.hearts.loseHeart();

		this.scene.time.delayedCall(250, () => {
			player.isHit = false;
		});

		if (this.ui.hearts.getHearts() <= 0) {
			this.sound.stopMusic();
			this.scene.scene.restart();
		}
	}

	// ---------- Bricks ----------

	private pickBrick(player: Player, brick: Brick) {
		if (player.heldBrick) {
			return;
		}
		if (!brick.canBePicked) {
			return;
		}
		if (brick.isHeld) {
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

		this.ui.hint.show("Appuyez sur ESPACE pour lancer la brique");
	}

	private brickHitEnemy(
		brickObj: Phaser.GameObjects.GameObject,
		enemyObj: Phaser.GameObjects.GameObject,
	) {
		const brick = brickObj as Brick;
		const enemy = enemyObj as Enemy;

		if (typeof (brick as Brick & { hit?: () => void }).hit !== "function") {
			return;
		}

		if (brick.isHeld) {
			return;
		}

		const body = brick.body as Phaser.Physics.Arcade.Body;
		const speed = Math.abs(body.velocity.x) + Math.abs(body.velocity.y);

		if (speed < 80) {
			return;
		}

		const enemyAny = enemy as Enemy & { squash?: () => void };

		if (enemyAny.squash) {
			enemyAny.squash();
		} else {
			enemy.destroy();
		}

		brick.hit();
		this.sound.playSfx("disappear_sound");
		this.ui.score.add(200);
	}

	// ---------- Void / mort ----------

	private fallToDeath() {
		if (this.levelEnding) return;
		this.levelEnding = true;

		const player = this.player;
		const body = player.body as Phaser.Physics.Arcade.Body;

		player.disableControls = true;
		body.setVelocity(0, 0);
		body.allowGravity = false;

		this.scene.tweens.add({
			targets: player,
			y: player.y - 30,
			duration: 180,
			ease: "Quad.easeOut",
			onComplete: () => {
				body.allowGravity = true;
				body.setVelocityY(450);
			},
		});

		this.scene.tweens.add({
			targets: player,
			angle: 90,
			duration: 600,
			ease: "Cubic.easeIn",
		});

		this.scene.tweens.add({
			targets: player,
			alpha: 0,
			delay: 150,
			duration: 900,
			ease: "Linear",
		});

		this.sound.playSfx("disappear_sound");

		this.scene.time.delayedCall(1500, () => {
			this.sound.stopMusic();
			this.scene.scene.restart();
		});
	}

	private enemyFallToDeath(_zone: Phaser.GameObjects.GameObject, enemy: Enemy) {
		const enemyAny = enemy as Enemy & { squash?: () => void };
		if (enemyAny.squash) {
			enemyAny.squash();
		} else {
			enemy.destroy();
		}
	}

	// ---------- Fin de niveau ----------

	private endLevel(player: Player, _flag: Flag) {
		if (this.levelEnding) return;
		this.levelEnding = true;

		const body = player.body as Phaser.Physics.Arcade.Body;

		player.setVelocity(0, 0);
		body.allowGravity = false;
		player.disableControls = true;

		this.sound.stopMusic();
		this.sound.playSfx("level_clear");

		this.scene.tweens.add({
			targets: player,
			y: player.y - 100,
			duration: 800,
			ease: "Sine.easeOut",
		});

		this.scene.tweens.add({
			targets: player,
			alpha: 0,
			duration: 900,
			delay: 400,
			ease: "Quad.easeIn",
		});

		// Sauvegarde des stats pour la scène Victory
		this.scene.time.delayedCall(1400, () => {
			this.scene.registry.set("lastScore", this.ui.score.getScore());
			this.scene.registry.set("lastStars", this.ui.stars.getStars());
			this.scene.registry.set(
				"lastTime",
				Math.floor(this.scene.time.now / 1000),
			);

			this.scene.scene.start("Victory");
		});
	}
}
