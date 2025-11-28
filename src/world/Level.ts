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

				// ✔ Origine en bas-centre (ce que tu veux visuellement)
				flag.setOrigin(0.5, 1);

				flag.body.setAllowGravity(false);
				flag.body.setImmovable(true);

				this.flag = flag;
			}
		}

		this.enemies = this.scene.add.group();

		// --- COINS ---
		this.coins = this.scene.physics.add.group();
		const coinsLayer = this.map.getObjectLayer("Coins");
		if (coinsLayer) {
			coinsLayer.objects.forEach((obj) => {
				// Conversion Tiled → Phaser
				const x = obj.x! + (obj.width ?? 32) / 2;
				const y = obj.y! - (obj.height ?? 32) / 2;

				const coin = new Coin(this.scene, x, y);
				this.coins.add(coin);
			});
		} else {
			console.warn("⚠️ Layer 'Coins' introuvable dans la map !");
		}

		const voidLayer = this.map.getObjectLayer("Void");
		if (voidLayer) {
			voidLayer.objects.forEach((obj) => {
				const isVoid = obj.properties?.some(
					(p) => p.name === "type" && p.value === "void",
				);

				if (isVoid) {
					const zone = this.scene.add
						.rectangle(obj.x!, obj.y!, obj.width!, obj.height!, 0xff0000, 0)
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
