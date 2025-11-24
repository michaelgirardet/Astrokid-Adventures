export default class Star extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y) {
      super(scene, x, y, "Star");

      scene.add.existing(this);
      scene.physics.add.existing(this);

      // Typage typescripts
      (this.body as Phaser.Physics.Arcade.Body).allowGravity = false;

      scene.tweens.add({
         targets: this,
         y: y - 8,
         duration: 800,
         yoyo: true,
         repeat: -1,
         ease: "Sine.easeInOut"
      });
   }
}
