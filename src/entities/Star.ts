export default class Star extends Phaser.Physics.Arcade.Sprite {
   constructor(scene, x, y) {
      super(scene, x, y, 'star');
      scene.add.existing(this);
      scene.physics.add.existing(this);
      this.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
   }
}
