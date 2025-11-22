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

    // Animation saut
    if (!this.body!.blocked.down) {
        if (this.anims.currentAnim?.key !== 'jump') {
            this.play('jump');
        }
        return;
    }

    // Gauche
    if (this.cursors.left.isDown) {
        this.setVelocityX(-speed);
        this.setFlipX(true);
        this.play('walk', true);
    }

    // Droite
    else if (this.cursors.right.isDown) {
        this.setVelocityX(speed);
        this.setFlipX(false);
        this.play('walk', true);
    }

    // Idle
    else {
        this.setVelocityX(0);
        this.play('idle', true);
    }

    // Saut (au sol)
    if (this.cursors.up.isDown && this.body!.blocked.down) {
        this.setVelocityY(-1800);
    }
}
}
