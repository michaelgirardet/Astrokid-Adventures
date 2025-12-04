import Phaser from "phaser";
import type Brick from "./Bricks";

export default class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private runKey!: Phaser.Input.Keyboard.Key;
  heldBrick?: Brick;
  throwKey!: Phaser.Input.Keyboard.Key;

  isInvincible = false;
  invincibleTimer = 0;
  disableControls = false;
  isHit = false;
  isDucking = false;
  lastAnim?: string;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    skin: string = "player1"
  ) {
    super(scene, x, y, skin);

    this.anims.play(skin + "-idle");

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setGravityY(300);
    this.setCollideWorldBounds(true);

    (this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(350, 900);

    // Hitbox standard
    this.body.setSize(this.width * 0.6, this.height * 0.9);
    this.body.setOffset(this.width * 0.2, this.height * 0.1);

    // Controls
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.runKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SHIFT
    );
    this.throwKey = scene.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  // --------------------------
  //  DUCK HANDLERS
  // --------------------------
  enterDuck() {
    console.log("➡️ ENTER DUCK");
    this.setVelocityX(0);

    if (this.lastAnim !== "player-duck") {
      this.play("player-duck");
      this.lastAnim = "player-duck";
    }

    const body = this.body as Phaser.Physics.Arcade.Body;

    // La hitbox doit se raccourcir vers le HAUT, pas vers le bas
    // Donc on modifie la hauteur, mais PAS la position du bas.

    const normalHeight = this.height * 0.9;
    const duckHeight = this.height * 0.5;

    const heightLoss = normalHeight - duckHeight;

    // Nouvelle taille
    body.setSize(this.width * 0.6, duckHeight);

    // Décalage vers le HAUT uniquement
    body.setOffset(this.width * 0.2, this.height * 0.1 + heightLoss);
  }

  exitDuck() {
    console.log("⬅️ EXIT DUCK");

    const body = this.body as Phaser.Physics.Arcade.Body;

    // Taille normale
    const normalHeight = this.height * 0.9;

    body.setSize(this.width * 0.6, normalHeight);

    // Offset normal
    body.setOffset(this.width * 0.2, this.height * 0.1);

    this.lastAnim = undefined;
  }

  update(_time: number, delta: number) {
    if (this.disableControls) return;

    if (this.isHit) {
      this.play("player-hit", true);
      return;
    }

    if (this.isInvincible) {
      this.invincibleTimer -= delta;
      if (this.invincibleTimer <= 0) {
        this.isInvincible = false;
        this.clearTint();
        this.setAlpha(1);
      }
    }

    // Lancer brique
    if (Phaser.Input.Keyboard.JustDown(this.throwKey) && this.heldBrick) {
      this.heldBrick.throw(this.flipX ? -1 : 1);
      this.heldBrick = undefined;
    }

    const onGround = this.body.blocked.down;

    //Duck
    if (this.cursors.down.isDown && onGround) {
      if (!this.isDucking) {
        this.isDucking = true;
        this.enterDuck();
      }
    } else if (this.isDucking) {
      this.isDucking = false;
      this.exitDuck();
    }

    if (this.isDucking) return;

    // Move
    const baseSpeed = 200;
    const runSpeed = 350;
    const speed = this.runKey.isDown ? runSpeed : baseSpeed;

    if (this.cursors.left.isDown) {
      this.setVelocityX(-speed);
      this.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.setVelocityX(speed);
      this.setFlipX(false);
    } else {
      this.setVelocityX(0);
    }

    // Jump
    if (Phaser.Input.Keyboard.JustDown(this.cursors.up) && onGround) {
      this.setVelocityY(-800);
      const sc = this.scene as Phaser.Scene & { jumpSound?: { play(): void } };
      sc.jumpSound?.play();
    }

    // Pick brick
    if (this.heldBrick) {
      this.heldBrick.setPosition(this.x, this.y - 40);
    }

    // Animate
    if (!onGround) {
      if (this.lastAnim !== "player-jump") {
        this.play("player-jump", true);
        this.lastAnim = "player-jump";
      }
      return;
    }

    if (this.cursors.left.isDown || this.cursors.right.isDown) {
      if (this.lastAnim !== "player-walk") {
        this.play("player-walk");
        this.lastAnim = "player-walk";
      }
      return;
    }

    if (this.lastAnim !== "player-idle") {
      this.play("player-idle", true);
      this.lastAnim = "player-idle";
    }
  }
}
