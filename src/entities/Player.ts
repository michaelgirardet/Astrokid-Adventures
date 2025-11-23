export default class Player extends Phaser.Physics.Arcade.Sprite {

    private cursors: Phaser.Types.Input.Keyboard.CursorKeys;

    constructor(scene: Phaser.Scene, x: number, y: number) {
        super(scene, x, y, 'player_idle');

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setGravityY(300);
        this.setCollideWorldBounds(true);
        this.body!.setSize(this.width * 0.6, this.height * 0.9);

        this.cursors = scene.input.keyboard.createCursorKeys();
    }

    update() {

        const speed = 200;

        // -- SAUT --
        if (this.cursors.up.isDown && this.body!.blocked.down) {
            this.setVelocityY(-800);
        }

        // -- MOUVEMENT --
        if (this.cursors.left.isDown) {
            this.setVelocityX(-speed);
            this.setFlipX(true);
        }
        else if (this.cursors.right.isDown) {
            this.setVelocityX(speed);
            this.setFlipX(false);
        }
        else {
            // On ne bloque que si on est au sol
            if (this.body!.blocked.down) {
                this.setVelocityX(0);
            }
        }

        // -- ANIMATIONS --
        if (!this.body!.blocked.down) {
            this.play("jump", true);
            return;  
        }

        if (this.cursors.left.isDown || this.cursors.right.isDown) {
            this.play("walk", true);
        } else {
            this.play("idle", true);
        }
    }
}
