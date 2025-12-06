import type { BaseLevel } from "../world/BaseLevel";
import type Enemy from "../entities/Enemy";
import EnemyBee from "../entities/enemies/EnemyBee";
import EnemyBlob from "../entities/enemies/EnemyBlob";
import EnemyFly from "../entities/enemies/EnemyFly";
import EnemyWorm from "../entities/enemies/EnemyWorm";

export default class EnemyManager {
	private scene: Phaser.Scene;
	private level: BaseLevel;

	constructor(scene: Phaser.Scene, level: BaseLevel) {
		this.scene = scene;
		this.level = level;
	}

	/**
	 * Instancie les ennemis à partir du layer "Enemies" de Tiled
	 * et les ajoute dans level.enemies.
	 */
	spawnFromMap() {
		const enemyObjects =
			this.level.map.getObjectLayer("Enemies")?.objects ?? [];

		enemyObjects.forEach((obj) => {
			const props: Record<string, unknown> = {};
			obj.properties?.forEach((p) => {
				props[p.name] = p.value;
			});

			const type = props.type as string | undefined;
			let enemy: Enemy | undefined;

			if (type === "fly") {
				enemy = new EnemyFly(this.scene, obj.x, obj.y, props);
			} else if (type === "blob") {
				const spawnY = obj.y - (obj.height ?? 32);
				enemy = new EnemyBlob(this.scene, obj.x, spawnY, props);
			} else if (type === "worm") {
				const spawnY = obj.y - (obj.height ?? 16);
				enemy = new EnemyWorm(this.scene, obj.x, spawnY, props);
			} else if (type === "bee") {
				enemy = new EnemyBee(this.scene, obj.x, obj.y, props);
			} else {
				console.warn("Unknown enemy type:", type);
				return;
			}

			enemy.setDepth(10);
			this.level.enemies.add(enemy);
		});
	}
}
