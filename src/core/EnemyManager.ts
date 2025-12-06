/**
 * @class EnemyManager
 * @classdesc
 * Responsable de la **création et initialisation de tous les ennemis**
 * définis dans Tiled via le layer "Enemies".
 *
 * 👉 Rôle :
 * - Lire les objets Tiled du layer "Enemies"
 * - Instancier la bonne classe d'ennemi selon `type`
 * - Appliquer les propriétés personnalisées de Tiled
 * - Ajouter chaque ennemi au groupe arcade du niveau
 *
 * @remarks
 * Cette classe n'est pas responsable :
 * - du comportement des ennemis (AI, mouvement)
 * - des collisions (gérées par CollisionManager)
 * - de la mise à jour (runChildUpdate est activé sur le groupe)
 */

import type { BaseLevel } from "../world/BaseLevel";
import type Enemy from "../entities/Enemy";

import EnemyBee from "../entities/enemies/EnemyBee";
import EnemyBlob from "../entities/enemies/EnemyBlob";
import EnemyFly from "../entities/enemies/EnemyFly";
import EnemyWorm from "../entities/enemies/EnemyWorm";

/**
 * Liste des types d’ennemis pris en charge.
 */
type EnemyType = "fly" | "blob" | "worm" | "bee";

export default class EnemyManager {
	private scene: Phaser.Scene;
	private level: BaseLevel;

	/**
	 * Création du gestionnaire d'ennemis.
	 *
	 * @param scene - La scène Phaser active
	 * @param level - Le niveau chargé contenant map + groupes
	 */
	constructor(scene: Phaser.Scene, level: BaseLevel) {
		this.scene = scene;
		this.level = level;
	}

	/**
	 * Parcourt le layer "Enemies" dans Tiled et instancie correctement
	 * chaque ennemi selon sa propriété `type`.
	 *
	 * @remarks
	 * Les ennemis sont automatiquement ajoutés dans `level.enemies`
	 * et mis à jour via `runChildUpdate: true`.
	 *
	 * @throws Aucun — mais log un warning si un type inconnu est trouvé.
	 */
	spawnFromMap() {
		const layer = this.level.map.getObjectLayer("Enemies");
		if (!layer) {
			console.warn("[EnemyManager] Aucun layer 'Enemies' trouvé dans Tiled.");
			return;
		}

		const enemyObjects = layer.objects;

		enemyObjects.forEach((obj) => {
			// Récupération des propriétés Tiled
			const props: Record<string, unknown> = {};
			obj.properties?.forEach((p) => {
				props[p.name] = p.value;
			});

			const type = props.type as EnemyType | undefined;
			let enemy: Enemy | undefined;

			switch (type) {
				case "fly":
					enemy = new EnemyFly(this.scene, obj.x, obj.y, props);
					break;

				case "blob": {
					// Correction de position propre au Blob
					const spawnY = obj.y - (obj.height ?? 32);
					enemy = new EnemyBlob(this.scene, obj.x, spawnY, props);
					break;
				}

				case "worm": {
					const spawnY = obj.y - (obj.height ?? 16);
					enemy = new EnemyWorm(this.scene, obj.x, spawnY, props);
					break;
				}

				case "bee":
					enemy = new EnemyBee(this.scene, obj.x, obj.y, props);
					break;

				default:
					console.warn(
						`[EnemyManager] Type d'ennemi inconnu dans Tiled : "${type}".`,
					);
					return;
			}

			// Applique une profondeur par défaut (devant le décor)
			enemy.setDepth(10);

			// Ajout dans le groupe Arcade du niveau
			this.level.enemies.add(enemy);
		});
	}
}
