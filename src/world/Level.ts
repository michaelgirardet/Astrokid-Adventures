import Brick from "../entities/Bricks";
import Coin from "../entities/Coin";

export class Level {
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
		this.bricks = this.scene.physics.add.group({
			classType: Brick,
			runChildUpdate: true,
		});

		// Briques
		const brickLayer = this.map.getObjectLayer("Bricks");

		if (brickLayer) {
			brickLayer.objects.forEach((obj) => {
				const x = obj.x + (obj.width ?? 32) / 2;
				const y = obj.y + (obj.height ?? 32) / 2;

				const props: Record<string, any> = {};
				obj.properties?.forEach((p) => {
					props[p.name] = p.value;
				});

				const color = props.color === "grey" ? "grey" : "brown";

				// ✔ Création réelle de la brique via le constructeur
				const brick = new Brick(this.scene, x, y, color);

				// ✔ Ajout au groupe
				this.bricks.add(brick);

				// les props custom sont déjà dans ton constructeur
			});
		}

		// Drapeau
		const endLayer = this.map.getObjectLayer("Flag");
		if (endLayer) {
			const flagObj = endLayer.objects.find((obj) =>
				obj.properties?.some((p) => p.name === "type" && p.value === "flag"),
			);

			if (flagObj) {
				const flag = this.scene.physics.add.sprite(
					flagObj.x,
					flagObj.y,
					"flag",
				);
				flag.setOrigin(0.5, 1);

				flag.body.setAllowGravity(false);
				flag.body.setImmovable(true);
				this.flag = flag;
			}
		}
		this.enemies = this.scene.physics.add.group({
			runChildUpdate: true,
		});

		// Gemmes
		this.coins = this.scene.physics.add.group();
		const coinsLayer = this.map.getObjectLayer("Coins");
		if (coinsLayer) {
			coinsLayer.objects.forEach((obj) => {
				const x = obj.x + (obj.width ?? 32) / 2;
				const y = obj.y - (obj.height ?? 32) / 2;

				const coin = new Coin(this.scene, x, y);
				this.coins.add(coin);
			});
		}

		const voidLayer = this.map.getObjectLayer("Void");
		if (voidLayer) {
			voidLayer.objects.forEach((obj) => {
				const isVoid = obj.properties?.some(
					(p) => p.name === "type" && p.value === "void",
				);

				if (isVoid) {
					const zone = this.scene.add
						.rectangle(obj.x, obj.y, obj.width, obj.height, 0xff0000, 0)
						.setOrigin(0, 0);

					// physics body
					this.scene.physics.add.existing(zone, true);

					this.voidZones.push(
						zone as Phaser.GameObjects.Rectangle &
							Phaser.Types.Physics.Arcade.GameObjectWithBody,
					);
				}
			});
		}
		// World
		this.scene.physics.world.setBounds(
			0,
			0,
			this.map.widthInPixels,
			this.map.heightInPixels,
		);
	}
}
