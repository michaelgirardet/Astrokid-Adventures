import type { BaseLevel } from "../world/BaseLevel";
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
import EnemyWorm from "../entities/enemies/EnemyWorm";
import EnemyBee from "../entities/enemies/EnemyBee";
import Forest from "../world/Forest";

export default class GameScene extends Phaser.Scene {
  private level!: BaseLevel;
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
  private levelEnding = false;

  constructor() {
    super("Game");
  }

  create() {
    this.levelEnding = false;
    this.level = new Forest(this);
    this.level.load();
    this.physics.world.TILE_BIAS = 60;
    this.hud = new HUD(this);
    this.starUI = this.hud.getStars();
    this.heartUI = this.hud.getHearts();
    this.scoreUI = this.hud.getScore();
    this.gameMusic = this.sound.add("level1", {
      volume: 0.05,
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
      "Player",
      (obj) => obj.name === "Player"
    );

    // Récupérer le personnage choisi depuis CharacterSelect
    const chosen = this.registry.get("selectedCharacter") || "player1";

    // Créer le joueur avec le bon skin
    this.player = new Player(this, spawn.x, spawn.y, chosen);

    // Zones vides
    this.level.voidZones.forEach((zone) => {
      this.physics.add.overlap(
        this.player,
        zone,
        this.fallToDeath,
        undefined,
        this
      );
    });

    // Zones vides
    this.level.voidZones.forEach((zone) => {
      this.physics.add.overlap(
        this.player,
        zone,
        this.fallToDeath,
        undefined,
        this
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
      } else if (props.type === "worm") {
        enemy = new EnemyWorm(this, obj.x, obj.y - (obj.height || 16), props);
      } else if (props.type === "bee") {
        enemy = new EnemyBee(this, obj.x, obj.y, props);
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
      this
    );

    // Collisions ennemis -> environnement
    this.physics.add.collider(
      this.level.enemies.getChildren().filter((e) => e instanceof EnemyBlob),
      this.level.groundLayer
    );

    this.physics.add.collider(
      this.level.enemies.getChildren().filter((e) => e instanceof EnemyBlob),
      this.level.blocksLayer
    );

    this.physics.add.collider(
      this.level.enemies.getChildren().filter((e) => e instanceof EnemyWorm),
      this.level.groundLayer
    );

    this.physics.add.collider(
      this.level.enemies.getChildren().filter((e) => e instanceof EnemyWorm),
      this.level.blocksLayer
    );

    this.level.voidZones.forEach((zone) => {
      this.physics.add.overlap(
        zone,
        this.level.enemies,
        this.enemyFallToDeath,
        undefined,
        this
      );
    });

    this.physics.add.overlap(
      this.player,
      this.level.enemies,
      this.hitEnemyFromAbove,
      this.checkIfAbove,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.level.coins,
      this.collectCoin,
      undefined,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.stars,
      this.collectStar,
      undefined,
      this
    );

    // Drapeau
    this.physics.add.overlap(
      this.player,
      this.level.flag,
      this.endLevel,
      undefined,
      this
    );

    // Ramasser une brique
    this.brickPickupOverlap = this.physics.add.overlap(
      this.player,
      this.level.bricks,
      this.pickBrick,
      undefined,
      this
    );
    // Brique touche un ennemi
    this.physics.add.collider(
      this.level.bricks,
      this.level.enemies,
      this.brickHitEnemy,
      undefined,
      this
    );
    this.physics.add.collider(this.level.bricks, this.level.groundLayer);
    this.physics.add.collider(this.level.bricks, this.level.blocksLayer);

    // Caméra
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(
      0,
      0,
      this.level.map.widthInPixels,
      this.level.map.heightInPixels
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
    const pb = player.body;
    const eb = enemy.body;

    return (
      pb.velocity.y > 0 &&
      pb.bottom > eb.top &&
      pb.bottom - pb.velocity.y <= eb.top
    );
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

    player.setVelocityY(-350);
  }

  hitEnemy(player: Player, enemy: any) {
    const bodyP = player.body as Phaser.Physics.Arcade.Body;
    const bodyE = enemy.body as Phaser.Physics.Arcade.Body;

    const playerBottom = bodyP.bottom;
    const enemyTop = bodyE.top;
    const comingDownFast = bodyP.velocity.y > 150;

    const isAbove = playerBottom < enemyTop + 10 && comingDownFast;

    // -------- Si on vient d'au-dessus → stomp --------
    if (isAbove) {
      if (enemy.squash) enemy.squash();
      else enemy.destroy();

      this.disappearSound.play();
      player.setVelocityY(-500);
      return;
    }

    // -------- Sinon → dégâts pour le joueur --------
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

    this.time.delayedCall(250, () => {
      player.isHit = false;
    });

    if (this.heartUI.getHearts() <= 0) {
      this.scene.restart();
      this.gameMusic.stop();
    }
  }

  pickBrick(player: Player, brick: Brick) {
    if (player.heldBrick) {
      console.warn("⚠️ Player already holding a brick.");
      return;
    }

    if (!brick.canBePicked) {
      console.warn("⏳ Brick not pickable yet.");
      return;
    }

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

    this.hud.getHint().show("Appuyez sur ESPACE pour lancer la brique");
  }

  brickHitEnemy(
    brickObj: Phaser.GameObjects.GameObject,
    enemyObj: Phaser.GameObjects.GameObject
  ) {
    const brick = brickObj as Brick;
    const enemy = enemyObj as Enemy;

    if (typeof (brick as any).hit !== "function") {
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

    const enemyAny = enemy as any;

    if (typeof enemyAny.squash === "function") {
      enemyAny.squash();
    } else {
      enemy.destroy();
    }

    brick.hit();
    this.disappearSound.play();
    this.scoreUI.add(200);
  }

  fallToDeath() {
    if (this.levelEnding) return;
    this.levelEnding = true;

    const player = this.player;
    const body = player.body as Phaser.Physics.Arcade.Body;

    player.disableControls = true;
    body.setVelocity(0, 0);
    body.allowGravity = false;
    this.tweens.add({
      targets: player,
      y: player.y - 30,
      duration: 180,
      ease: "Quad.easeOut",
      onComplete: () => {
        body.allowGravity = true;
        body.setVelocityY(450);
      },
    });
    this.tweens.add({
      targets: player,
      angle: 90,
      duration: 600,
      ease: "Cubic.easeIn",
    });

    this.tweens.add({
      targets: player,
      alpha: 0,
      delay: 150,
      duration: 900,
      ease: "Linear",
    });

    this.disappearSound.play();

    this.time.delayedCall(1500, () => {
      this.scene.restart();
      this.gameMusic.stop();
    });
  }
  enemyFallToDeath(_zone, enemy: Enemy) {
    if (enemy.die) {
      enemy.squash();
    } else {
      enemy.destroy();
    }
  }

  // Fin de niveau
  endLevel(player: Player, _flag: Flag) {
    if (this.levelEnding) return;
    this.levelEnding = true;

    // Bloquer le joueur
    player.setVelocity(0, 0);
    (player.body as Phaser.Physics.Arcade.Body).allowGravity = false;
    player.disableControls = true;

    // Stop musique + jouer jingle
    this.gameMusic.stop();
    this.levelClear.play();

    // Petite animation vers le haut
    this.tweens.add({
      targets: player,
      y: player.y - 100,
      duration: 800,
      ease: "Sine.easeOut",
    });

    // Fade-out du joueur
    this.tweens.add({
      targets: player,
      alpha: 0,
      duration: 900,
      delay: 400,
      ease: "Quad.easeIn",
    });

    // Transition à la scène de victoire
    this.time.delayedCall(1400, () => {
      this.scene.start("Victory");
    });
    this.registry.set("lastScore", this.scoreUI.getScore());
    this.registry.set("lastStars", this.starUI.getStars());
    this.registry.set("lastTime", Math.floor(this.time.now / 1000));
  }
}
