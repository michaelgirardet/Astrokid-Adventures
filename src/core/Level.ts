import Coin from "../entities/Coin";
import EnemyFly from "../entities/enemies/EnemyFly";

export default class Level {

  public map!: Phaser.Tilemaps.Tilemap;

  public backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
  public groundLayer!: Phaser.Tilemaps.TilemapLayer;
  public blocksLayer!: Phaser.Tilemaps.TilemapLayer;

  public coins!: Phaser.GameObjects.Group;
  public enemies!: Phaser.GameObjects.Group;
  public flag!: Phaser.GameObjects.Rectangle & Phaser.Types.Physics.Arcade.GameObjectWithBody;

  constructor(private scene: Phaser.Scene) {}

  load() {

    this.map = this.scene.make.tilemap({ key: "level1" });

    // === TILESETS ===
    const background = this.map.addTilesetImage("Background", "Background");
    const tiles = this.map.addTilesetImage("Tiles", "Tiles");

    // === TILE LAYERS ===
    this.backgroundLayer = this.map.createLayer("Background", background, 0, 0);
    this.groundLayer = this.map.createLayer("Ground", tiles, 0, 0);
    this.blocksLayer = this.map.createLayer("Blocks", tiles, 0, 0);

    // Collisions
    this.groundLayer.setCollisionByProperty({ collides: true });
    this.blocksLayer.setCollisionByProperty({ collides: true });

    // === GROUPS ===
    this.coins = this.scene.add.group();
    this.enemies = this.scene.add.group();

    // === COINS ===
    const coinsLayer = this.map.getObjectLayer("Coins");
    if (coinsLayer) {
      coinsLayer.objects.forEach(obj => {
        if (obj.type === "coin") {
          this.coins.add(new Coin(this.scene, obj.x!, obj.y!));
        }
      });
    }

    // === ENEMIES ===
    // const enemiesLayer = this.map.getObjectLayer("Enemies");
    // if (enemiesLayer) {
    //   enemiesLayer.objects.forEach(obj => {
    //     if (obj.type === "enemy") {
    //       this.enemies.add(new EnemyFly(this.scene, obj.x!, obj.y!));
    //     }
    //   });
    // }

    // === FLAG ===
const endLayer = this.map.getObjectLayer("End");

if (endLayer) {

    const flagObj = endLayer.objects.find(obj => obj.type === "flag");

    if (flagObj) {

        // Créer une zone invisible pour détecter la fin
        const flag = this.scene.add.rectangle(
            flagObj.x!,
            flagObj.y!,
            flagObj.width! || 32,
            flagObj.height! || 32,
            0x00ff00,
            0 // invisible
        );

        // Physique statique
        this.scene.physics.add.existing(flag, true);

        this.flag = flag as unknown as Phaser.GameObjects.Rectangle & Phaser.Types.Physics.Arcade.GameObjectWithBody;
    }
}
    // === WORLD SIZE ===
    this.scene.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }
}
