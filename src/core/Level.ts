import Coin from "../entities/Coin";

export default class Level {

  public map!: Phaser.Tilemaps.Tilemap;
  public backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
  public groundLayer!: Phaser.Tilemaps.TilemapLayer;
  public blocksLayer!: Phaser.Tilemaps.TilemapLayer;
  public coins!: Phaser.GameObjects.Group;
  public enemies!: Phaser.GameObjects.Group;
  public flag!: Phaser.Physics.Arcade.Sprite;

  // On stocke plusieurs zones de vide si besoin
  public voidZones: (
      Phaser.GameObjects.Rectangle &
      Phaser.Types.Physics.Arcade.GameObjectWithBody
  )[] = [];

  constructor(private scene: Phaser.Scene) {}

  load() {

    this.map = this.scene.make.tilemap({ key: "level1" });

    const background = this.map.addTilesetImage("Background", "Background");
    const tiles = this.map.addTilesetImage("Tiles", "Tiles");

    this.backgroundLayer = this.map.createLayer("Background", background, 0, 0);
    this.groundLayer = this.map.createLayer("Ground", tiles, 0, 0);
    this.blocksLayer = this.map.createLayer("Blocks", tiles, 0, 0);

    this.groundLayer.setCollisionByProperty({ collides: true });
    this.blocksLayer.setCollisionByProperty({ collides: true });

    // --- FLAG ---
    const endLayer = this.map.getObjectLayer("Objects_Flag");
    if (endLayer) {

      const flagObj = endLayer.objects.find(obj =>
        obj.properties?.some(p => p.name === "type" && p.value === "flag")
      );

      if (flagObj) {
        const flag = this.scene.physics.add.sprite(
          flagObj.x!,
          flagObj.y! - (flagObj.height || 32),
          "flag"
        );

        flag.setOrigin(0.5, 1);
        flag.body.setAllowGravity(false);
        flag.body.setImmovable(true);

        this.flag = flag;
      }
    }

    // --- GROUPS ---
    this.coins = this.scene.add.group();
    this.enemies = this.scene.add.group();

    // --- COINS ---
    const coinsLayer = this.map.getObjectLayer("Coins");
    if (coinsLayer) {
      coinsLayer.objects.forEach(obj => {
        if (obj.type === "coin") {
          this.coins.add(new Coin(this.scene, obj.x!, obj.y!));
        }
      });
    }

    // --- VOID ZONES ---
    const voidLayer = this.map.getObjectLayer("Objects_Void");

    if (voidLayer) {
    voidLayer.objects.forEach(obj => {

        const isVoid = obj.properties?.some(
            p => p.name === "type" && p.value === "void"
        );

        if (isVoid) {

            const zone = this.scene.add.rectangle(
                obj.x!,
                obj.y!,
                obj.width!,
                obj.height!,
                0xff0000,
                0     // invisible
            ).setOrigin(0, 0);

            // physics body
            this.scene.physics.add.existing(zone, true);

            this.voidZones.push(
                zone as Phaser.GameObjects.Rectangle &
                      Phaser.Types.Physics.Arcade.GameObjectWithBody
            );
        }
    });
}

    // --- WORLD BOUNDS ---
    this.scene.physics.world.setBounds(
      0,
      0,
      this.map.widthInPixels,
      this.map.heightInPixels
    );
  }
}
