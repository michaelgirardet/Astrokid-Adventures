export default class Player extends Phaser.Physics.Arcade.Sprite {

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle');
        

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setGravityY(300);
        this.setCollideWorldBounds(true);

        (this.body as Phaser.Physics.Arcade.Body).setMaxVelocity(400, 800);

        // Hitbox
        this.body!.setSize(this.width * 0.6, this.height * 0.9);
        this.body!.setOffset(this.width * 0.2, this.height * 0.1);

        this.cursors = scene.input.keyboard.createCursorKeys();

        (this.scene as any).jumpSound.play();
    }

    isInvincible = false;
    invincibleTimer = 0;

    disableControls = false;

    update(time: number, delta: number) {
         if (this.disableControls) return;

    // Invincibilité ---------------------------------
    if (this.isInvincible) {
        this.invincibleTimer -= delta;
        if (this.invincibleTimer <= 0) {
            this.isInvincible = false;
            this.clearTint();
            this.setAlpha(1);
        }
    }

    const speed = 200;

    // --------- MOUVEMENT ---------
    if (this.cursors.left.isDown) {
        this.setVelocityX(-speed);
        this.setFlipX(true);
    }
    else if (this.cursors.right.isDown) {
        this.setVelocityX(speed);
        this.setFlipX(false);
    }
    else {
        this.setVelocityX(0);
    }

    // --------- SAUT ---------
    if (this.cursors.up.isDown && this.body!.blocked.down) {
       this.setVelocityY(-800);
    }

    // --------- ANIMATIONS ---------
    
    // En l’air → JUMP
    // --------- SAUT ---------
    if (this.cursors.up.isDown && this.body!.blocked.down) {
        this.setVelocityY(-800);

        // 🔊 SON DE SAUT
        if ((this.scene as any).jumpSound) {
            (this.scene as any).jumpSound.play();
        }
    }

    // Au sol → WALK
    if (this.cursors.left.isDown || this.cursors.right.isDown) {
        this.play("player-walk", true);
        return;
    }

    // Sinon → IDLE
    this.play("player-idle", true);
}

}
