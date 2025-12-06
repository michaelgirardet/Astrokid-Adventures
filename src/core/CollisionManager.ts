/**
 * @class CollisionManager
 * @classdesc
 * Gestion centralisée de **toutes les collisions et overlaps** de la scène de jeu.
 *
 * **Responsabilités principales :**
 * - Configurer les collisions Player ↔ Environnement
 * - Gérer Player ↔ Ennemis (dommages, stomp, invincibilité)
 * - Gérer Player ↔ Collectibles (coins, stars)
 * - Gérer Player ↔ Void (mort instantanée)
 * - Gérer Player ↔ Brick + Brick ↔ Ennemis
 * - Gérer Player ↔ Flag (fin de niveau)
 *
 * @remarks
 * Cette classe ne doit contenir **aucune logique de gameplay externe** :
 * - elle ne déplace pas les ennemis,
 * - ne met pas à jour l'UI,
 * - ne modifie pas la physique du joueur (sauf impact direct des collisions).
 *
 * Son rôle est uniquement de **connecter** les bons callbacks et événements
 * entre Player, Level, UIManager, SoundManager et les groupes Phaser.
 */

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

	/** Empêche les triggers multiples (mort, fin de niveau). */
	private levelEnding = false;

	/**
	 * Crée un gestionnaire de collisions pour la scène.
	 *
	 * @param scene - La scène Phaser active
	 * @param player - Le joueur principal
	 * @param level - Le level chargé (layers + objets)
	 * @param stars - Groupe des étoiles du niveau
	 * @param ui - UI manager pour score, cœurs, étoiles, messages
	 * @param sound - Gestionnaire de sons
	 */
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

	/**
	 * Configure **toutes** les collisions du jeu :
	 *
	 * - Player ↔ Sol / Blocks
	 * - Player ↔ Ennemis
	 * - Player ↔ Collectibles (coins, stars)
	 * - Player ↔ Void
	 * - Player ↔ Flag
	 * - Player ↔ Brick, Brick ↔ Ennemis
	 *
	 * @remarks
	 * Cette méthode doit être appelée **une seule fois**, dans `GameScene.create()`.
	 */
	setup() {
		const physics = this.scene.physics;

		// Player / Environnement
		physics.add.collider(this.player, this.level.groundLayer);
		physics.add.collider(this.player, this.level.blocksLayer);

		// Enemies / Environnement
		physics.add.collider(this.level.enemies, this.level.groundLayer);
		physics.add.collider(this.level.enemies, this.level.blocksLayer);

		// Player / Ennemis
		physics.add.collider(
			this.player,
			this.level.enemies,
			this.handlePlayerEnemyCollision,
			undefined,
			this,
		);
		// --- Player / Coins ---
		physics.add.overlap(
			this.player,
			this.level.coins,
			this.collectCoin,
			undefined,
			this,
		);

		// Player / Stars
		physics.add.overlap(
			this.player,
			this.stars,
			this.collectStar,
			undefined,
			this,
		);

		// Player / Flag (fin de niveau)
		physics.add.overlap(
			this.player,
			this.level.flag,
			this.endLevel,
			undefined,
			this,
		);

		// Player / Void
		this.level.voidZones.forEach((zone) => {
			physics.add.overlap(this.player, zone, this.fallToDeath, undefined, this);
		});

		// Ennemis / Void
		this.level.voidZones.forEach((zone) => {
			physics.add.overlap(
				zone,
				this.level.enemies,
				this.enemyFallToDeath,
				undefined,
				this,
			);
		});

		// Player / Bricks
		physics.add.overlap(
			this.player,
			this.level.bricks,
			this.pickBrick,
			undefined,
			this,
		);

		// Brick / Ennemis
		physics.add.collider(
			this.level.bricks,
			this.level.enemies,
			this.brickHitEnemy,
			undefined,
			this,
		);

		// Bricks ↔ Environnement
		physics.add.collider(this.level.bricks, this.level.groundLayer);
		physics.add.collider(this.level.bricks, this.level.blocksLayer);
	}

	// COLLECTIBLES

	/** Collecte d'une étoile. */
	private collectStar(_player: Player, star: Star) {
		star.disableBody(true, true);
		this.ui.stars.addStar();
		this.ui.score.add(1000);
		this.sound.playSfx("star_sound");
	}

	/** Collecte d'une pièce. */
	private collectCoin(_player: Player, coin: Coin) {
		coin.destroy();
		this.ui.score.add(100);
		this.sound.playSfx("coin_sound");
	}

	// COMBAT : Player ↔ Ennemis

	/**
	 * Vérifie si le joueur effectue un stomp légitime sur l'ennemi.
	 * Prend en compte la vitesse horizontale pour ajuster la tolérance.
	 */
	private checkIfAbove(player: Player, enemy: Enemy): boolean {
		const pb = player.body as Phaser.Physics.Arcade.Body;
		const eb = enemy.body as Phaser.Physics.Arcade.Body;

		const isFalling = pb.velocity.y > 50;

		// Tolérance dynamique
		const horizontalSpeed = Math.abs(pb.velocity.x);
		const tolerance =
			horizontalSpeed > 250 ? 15 : horizontalSpeed > 150 ? 10 : 6;

		const isAbove = pb.bottom <= eb.top + tolerance;

		// Vérifier que la composante verticale est significative
		// (évite les collisions purement latérales)
		const verticalComponent = Math.abs(pb.velocity.y);
		const horizontalComponent = Math.abs(pb.velocity.x);
		const hasVerticalMomentum = verticalComponent > horizontalComponent * 0.3;

		return isFalling && isAbove && hasVerticalMomentum;
	}

	/**
	 * Stomp de l'ennemi lorsque le joueur arrive au-dessus.
	 */
	private hitEnemyFromAbove(player: Player, enemy: Enemy) {
		const enemyAny = enemy as Enemy & { squash?: () => void };

		if (enemyAny.squash) enemyAny.squash();
		else enemy.destroy();

		this.sound.playSfx("disappear_sound");

		player.body.checkCollision.none = true;
		this.scene.time.delayedCall(120, () => {
			player.body.checkCollision.none = false;
		});

		player.setVelocityY(-350);
	}

	/**
	 * Collision directe : le joueur touche un ennemi **sans** être au-dessus.
	 * Gère :
	 * - dégâts
	 * - invincibilité
	 * - perte de cœurs
	 * - mort (game over)
	 */
	private hitEnemy(player: Player, enemy: Enemy) {
		// Si le joueur est invincible, on ignore
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

	private handlePlayerEnemyCollision(player: Player, enemy: Enemy) {
		// Si le joueur arrive vraiment par au-dessus → stomp
		if (this.checkIfAbove(player, enemy)) {
			this.hitEnemyFromAbove(player, enemy);
			return;
		}

		// Sinon → le joueur prend des dégâts
		this.hitEnemy(player, enemy);
	}

	/** Ramassage d’une brique par le joueur. */
	private pickBrick(player: Player, brick: Brick) {
		if (player.heldBrick || !brick.canBePicked || brick.isHeld) return;

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

	/** La brique lancée frappe un ennemi. */
	private brickHitEnemy(
		brickObj: Phaser.GameObjects.GameObject,
		enemyObj: Phaser.GameObjects.GameObject,
	) {
		const brick = brickObj as Brick;
		const enemy = enemyObj as Enemy;

		const brickAny = brick as Brick & { hit?: () => void };
		if (!brickAny.hit || brick.isHeld) return;

		const body = brick.body as Phaser.Physics.Arcade.Body;
		const speed = Math.abs(body.velocity.x) + Math.abs(body.velocity.y);
		if (speed < 80) return;

		const enemyAny = enemy as Enemy & { squash?: () => void };
		if (enemyAny.squash) enemyAny.squash();
		else enemy.destroy();

		brick.hit();
		this.sound.playSfx("disappear_sound");
		this.ui.score.add(200);
	}

	/**
	 * Mort du joueur en tombant dans le vide.
	 */
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

	/** Ennemi tombant dans le vide. */
	private enemyFallToDeath(_zone: Phaser.GameObjects.GameObject, enemy: Enemy) {
		const enemyAny = enemy as Enemy & { squash?: () => void };
		if (enemyAny.squash) enemyAny.squash();
		else enemy.destroy();
	}

	/**
	 * Trigger de fin de niveau lorsque le joueur atteint le drapeau.
	 *
	 * - joue la musique de victoire
	 * - bloque le joueur
	 * - anime la sortie
	 * - enregistre les stats
	 * - charge VictoryScene
	 */
	private endLevel(player: Player, _flag: Flag) {
		if (this.levelEnding) return;
		this.levelEnding = true;

		const body = player.body as Phaser.Physics.Arcade.Body;

		player.disableControls = true;
		player.setVelocity(0, 0);
		body.allowGravity = false;

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
			delay: 400,
			duration: 900,
			ease: "Quad.easeIn",
		});

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
