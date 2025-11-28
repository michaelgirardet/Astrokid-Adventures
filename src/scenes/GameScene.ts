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
			volume: 0.2,
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
		const enemyObjects =
			this.level.map.getObjectLayer("Enemies").objects;

		enemyObjects.forEach((obj) => {
			const x = obj.x;
			const y = obj.y - (obj.height || 32);

			const props: any = {};
			obj.properties?.forEach((p: any) => {
				props[p.name] = p.value;
			});

			let enemy: Phaser.GameObjects.GameObject;

			switch (props.type) {
				case "fly":
					enemy = new EnemyFly(this, x, y, props);
					break;
				case "blob":
					enemy = new EnemyBlob(this, x, y, props);
					break;
				default:
					console.warn("Unknown enemy type:", props.type);
			}

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
		this.physics.add.collider(this.level.enemies, this.level.groundLayer);
		this.physics.add.collider(this.level.enemies, this.level.blocksLayer);
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

		// Ramasser une brique
		this.physics.add.overlap(
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

		this.level.enemies.children.each((enemy: any) => {
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
	collectStar(player: Player, star: Star) {
		star.disableBody(true, true);
		this.starUI.addStar();
		this.starSound.play();
		this.scoreUI.add(1000);
	}

	collectCoin(player: Player, coin: any) {
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

	hitEnemyFromAbove(player, enemy) {
		if (enemy.squash) {
			enemy.squash();
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

	hitEnemy(player: Player, enemy: Enemy) {
		if (player.body.velocity.y > 0) return;
		if (player.isInvincible) return;

		this.hitSound.play();

		player.isHit = true;
		player.play("player-hit");

		// Invincibilité
		player.isInvincible = true;
		player.invincibleTimer = 1000;
		player.setTint(0xff5555);
		player.setAlpha(0.5);

		this.heartUI.loseHeart();

		// Reset HIT state après 250 ms
		this.time.delayedCall(250, () => {
			player.isHit = false;
		});

		if (this.heartUI.getHearts() <= 0) {
			console.log("GAME OVER");
			this.scene.restart();
			this.gameMusic.stop();
		}
	}

	pickBrick(player: Player, brick: Brick) {
		if (brick.isHeld) return; // éviter spam

		brick.isHeld = true;
		brick.holder = player;

		brick.body.enable = false;

		player.heldBrick = brick;

		console.log("Brique ramassée !");
	}

	brickHitEnemy(brick: any, enemy: any) {
		// Protéger le cas où le joueur porte la brique
		if (brick.isHeld) return;

		// Détruire l’ennemi
		if (enemy.squash) enemy.squash();
		else enemy.destroy();

		// Casser la brique
		brick.destroy();

		console.log("Un ennemi a été touché par une brique !");
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
	endLevel(player: Player, flag: any) {
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
