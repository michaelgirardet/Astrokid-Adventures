export default class Player extends Phaser.Physics.Arcade.Sprite {

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setGravityY(300);
        this.setCollideWorldBounds(true);

        // Hitbox un peu réduite
        this.body!.setSize(this.width * 0.6, this.height * 0.9);
        this.body!.setOffset(this.width * 0.2, this.height * 0.1);

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {

        const speed = 200;

        // --- SAUT ---
        if (this.cursors.up.isDown && this.body!.blocked.down) {
            this.setVelocityY(-800);
        }

        // --- MOUVEMENT ---
        if (this.cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(true);
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(false);
        }
        else {
            if (this.body!.blocked.down) {
                this.setVelocityX(0);
            }
        }

        // --- ANIMATIONS ---

        // En l'air → ANIM JUMP
        if (!this.body!.blocked.down) {
            this.play("player-jump", true); // ⚠️ corrigé !
            return;
        }

        // Au sol et on bouge → ANIM WALK
        if (this.cursors.left.isDown || this.cursors.right.isDown) {
            this.play("player-walk", true);
        }
        else {
            // Debout immobile → ANIM IDLE
            this.play("player-idle", true);
        }
    }
}
