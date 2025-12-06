import type { BaseLevel } from "../world/BaseLevel";
import CollisionManager from "../core/CollisionManager";
import { createPlayer } from "../core/PlayerFactory";
import EnemyManager from "../core/EnemyManager";
import LevelLoader from "../core/LevelLoader";
import SoundManager from "../core/SoundManager";
import UIManager from "../core/UIManager";

import type Player from "../entities/Player";
import Star from "../entities/Star";

/**
 * Scene principale du jeu.
 *
 * @description
 * Cette scène joue le rôle d’orchestrateur global :
 * - instanciation du niveau (via LevelLoader),
 * - création et gestion du joueur,
 * - génération des ennemis depuis les données Tiled,
 * - initialisation de l’UI, des sons et des collisions,
 * - configuration de la caméra.
 *
 * GameScene ne contient volontairement aucune logique spécifique :
 * tout est délégué à des managers spécialisés, afin de maintenir une
 * architecture modulaire, testable et extensible.
 *
 * @remarks
 * Cette structure est inspirée d’architectures utilisées en production
 * dans des jeux 2D professionnels : chaque système est encapsulé
 * dans un manager dédié (Input, Level, UI, Enemies, Collisions…),
 * évitant une scène « monolithe » difficile à maintenir.
 *
 * @see LevelLoader
 * @see EnemyManager
 * @see CollisionManager
 * @see SoundManager
 * @see UIManager
 */
export default class GameScene extends Phaser.Scene {
	/** Niveau Tiled actuellement chargé. */
	private level!: BaseLevel;

	/** Instance du joueur contrôlé par l’utilisateur. */
	private player!: Player;

	/** Groupe contenant toutes les étoiles collectables. */
	private stars!: Phaser.Physics.Arcade.Group;

	/** Gestion centralisée de la musique et des effets sonores. */
	private sounds!: SoundManager;

	/** Gestion de l'affichage HUD (score, vies, étoiles). */
	private ui!: UIManager;

	/** Gestion de l’apparition et de la mise à jour des ennemis. */
	private enemyManager!: EnemyManager;

	/** Gestion centralisée de toutes les collisions. */
	private collisionManager!: CollisionManager;

	constructor() {
		super("Game");
	}

	/**
	 * Point d’entrée de la scène.
	 *
	 * @details
	 * Étapes principales :
	 * 1. Instanciation des managers
	 * 2. Chargement du niveau (tiles, couches, objets Tiled)
	 * 3. Création du joueur au point de spawn
	 * 4. Génération des ennemis depuis les objets Tiled
	 * 5. Mise en place des collisions
	 * 6. Démarrage de la caméra et de la musique
	 *
	 * Aucun système n'est géré directement dans GameScene :
	 * tout est délégué à des classes spécialisées.
	 */
	create() {
		this.sounds = new SoundManager(this);
		this.ui = new UIManager(this);

		const loader = new LevelLoader(this);
		this.level = loader.load();

		this.physics.world.TILE_BIAS = 60;

		this.sounds.playMusic("level1", 0.05);

		this.input.keyboard.on("keydown-ESC", () => {
			this.scene.launch("Pause");
			this.scene.pause();
		});

		const spawn = this.level.map.findObject(
			"Player",
			(obj) => obj.name === "Player",
		);

		if (!spawn) {
			throw new Error("No Player spawn point found in map");
		}

		const chosen =
			(this.registry.get("selected_character") as string | undefined) ||
			"yellow";

		this.player = createPlayer(this, spawn.x, spawn.y, chosen);

		this.enemyManager = new EnemyManager(this, this.level);
		this.enemyManager.spawnFromMap();

		this.stars = this.physics.add.group();
		const starObjects = this.level.map.getObjectLayer("Stars")?.objects ?? [];
		starObjects.forEach((obj) => {
			this.stars.add(new Star(this, obj.x, obj.y));
		});

		this.collisionManager = new CollisionManager(
			this,
			this.player,
			this.level,
			this.stars,
			this.ui,
			this.sounds,
		);
		this.collisionManager.setup();

		this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
		this.cameras.main.setBounds(
			0,
			0,
			this.level.map.widthInPixels,
			this.level.map.heightInPixels,
		);
	}

	/**
	 * Boucle principale exécutée à chaque frame.
	 *
	 * @param time - Temps total écoulé depuis le lancement du jeu
	 * @param delta - Temps écoulé depuis la dernière frame
	 *
	 * @remarks
	 * Seul le joueur est mis à jour ici.
	 * Les ennemis sont mis à jour automatiquement via `runChildUpdate: true`.
	 */
	update(time: number, delta: number) {
		this.player.update(time, delta);
	}

	/**
	 * Méthode utilitaire permettant de faire apparaître une rangée d’étoiles.
	 * Purement utilisée pour des tests ou du debug.
	 */
	spawnStars() {
		for (let i = 0; i < 12; i++) {
			const star = new Star(this, 12 + i * 70, 0);
			this.stars.add(star);
		}
	}
}
