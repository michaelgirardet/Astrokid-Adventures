import Brick from "../entities/Bricks";
import Coin from "../entities/Coin";

export abstract class BaseLevel {
	public backgroundLayer!: Phaser.Tilemaps.TilemapLayer;
	public blocksLayer!: Phaser.Tilemaps.TilemapLayer;
	public coins!: Phaser.GameObjects.Group;
	public enemies!: Phaser.GameObjects.Group;
	public flag!: Phaser.Physics.Arcade.Sprite;
	public groundLayer!: Phaser.Tilemaps.TilemapLayer;
	public map!: Phaser.Tilemaps.Tilemap;
	public voidZones: (Phaser.GameObjects.Rectangle &
		Phaser.Types.Physics.Arcade.GameObjectWithBody)[] = [];
	public bricks!: Phaser.Physics.Arcade.Group;

	constructor(public scene: Phaser.Scene) {}

	abstract getMapKey(): string;
	abstract getTileset(): { tiles: string; background: string };

	load() {
		this.map = this.scene.make.tilemap({ key: this.getMapKey() });

		const { tiles, background } = this.getTileset();
		const bg = this.map.addTilesetImage(background, background);
		const tl = this.map.addTilesetImage(tiles, tiles);

		this.backgroundLayer = this.map.createLayer("Background", bg, 0, 0);
		this.groundLayer = this.map.createLayer("Ground", tl, 0, 0);
		this.blocksLayer = this.map.createLayer("Blocks", tl, 0, 0);

		this.groundLayer.setCollisionByProperty({ collides: true });
		this.blocksLayer.setCollisionByProperty({ collides: true });

		this.bricks = this.scene.physics.add.group({
			classType: Brick,
			runChildUpdate: true,
		});

		const brickLayer = this.map.getObjectLayer("Bricks");
		if (brickLayer) {
			brickLayer.objects.forEach((obj) => {
				const x = obj.x + (obj.width ?? 32) / 2;
				const y = obj.y + (obj.height ?? 32) / 2;
				const color =
					obj.properties?.find((p) => p.name === "color")?.value ?? "brown";

				this.bricks.add(new Brick(this.scene, x, y, color));
			});
		}

		const endLayer = this.map.getObjectLayer("Flag");

		if (endLayer) {
			const obj = endLayer.objects.find((o) =>
				o.properties?.some((p) => p.name === "type" && p.value === "flag"),
			);

			if (obj) {
				const x = obj.x;
				const y = obj.y + obj.height;

				const flag = this.scene.physics.add.sprite(x, y, "flag");
				flag.setOrigin(0.5, 1);

				flag.body.setAllowGravity(false);
				flag.body.setImmovable(true);

				this.flag = flag;
			}
		}

		this.enemies = this.scene.physics.add.group({ runChildUpdate: true });

		this.coins = this.scene.physics.add.group();
		const coinsLayer = this.map.getObjectLayer("Coins");
		if (coinsLayer) {
			coinsLayer.objects.forEach((obj) => {
				const x = obj.x + (obj.width ?? 32) / 2;
				const y = obj.y - (obj.height ?? 32) / 2;
				this.coins.add(new Coin(this.scene, x, y));
			});
		}

		const voidLayer = this.map.getObjectLayer("Void");
		if (voidLayer) {
			voidLayer.objects.forEach((obj) => {
				if (
					obj.properties?.some((p) => p.name === "type" && p.value === "void")
				) {
					const zone = this.scene.add
						.rectangle(obj.x, obj.y, obj.width, obj.height)
						.setOrigin(0, 0);
					this.scene.physics.add.existing(zone, true);
					this.voidZones.push(
						zone as Phaser.GameObjects.Rectangle &
							Phaser.Types.Physics.Arcade.GameObjectWithBody,
					);
				}
			});
		}
		this.scene.physics.world.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.map.heightInPixels,
		);
	}
}
