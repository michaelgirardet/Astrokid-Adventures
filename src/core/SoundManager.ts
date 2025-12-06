/**
 * @class SoundManager
 * @classdesc
 * Gestion centralisée de tous les sons du jeu : musique, effets sonores,
 * arrêt global, etc.
 *
 * **Responsabilités :**
 * - Démarrer/stopper proprement une musique de fond.
 * - Remplacer automatiquement la musique en cours lorsqu'une nouvelle commence.
 * - Jouer des effets sonores (SFX) avec volume configurable.
 * - Fournir une interface unique utilisée par toutes les scènes.
 *
 * **Ne gère pas :**
 * - Le mute global (géré par Menu/Pause + localStorage)
 * - Le traitement audio avancé
 * - Les spatialized audio (WebAudio 3D)
 */

export default class SoundManager {
	/** La scène qui possède les objets audio. */
	private scene: Phaser.Scene;

	/** La musique actuellement jouée (si existante). */
	private currentMusic?: Phaser.Sound.BaseSound;

	/**
	 * @param scene - La scène Phaser associée à ce gestionnaire.
	 */
	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

	/**
	 * Joue une musique de fond en boucle.
	 *
	 * Si une autre musique est déjà en cours, elle est automatiquement stoppée.
	 *
	 * @param key - La clé de l'audio préchargé dans le preloader.
	 * @param volume - Volume de lecture (défaut : `0.05`).
	 * @returns La musique jouée, pour chaînage ou écoute d’événements.
	 *
	 * @example
	 * ```ts
	 * this.sounds.playMusic("level1_theme");
	 * ```
	 */
	playMusic(key: string, volume = 0.05): Phaser.Sound.BaseSound {
		// Stoppe la musique précédente si besoin
		if (this.currentMusic) {
			this.currentMusic.stop();
		}

		const music = this.scene.sound.add(key, {
			volume,
			loop: true,
		});

		music.play();
		this.currentMusic = music;

		return music;
	}

	/**
	 * Stoppe uniquement la musique courante.
	 *
	 * @example
	 * ```ts
	 * this.sounds.stopMusic();
	 * ```
	 */
	stopMusic() {
		if (this.currentMusic) {
			this.currentMusic.stop();
			this.currentMusic = undefined;
		}
	}

	/**
	 * Arrête *tous* les sons du jeu (musique + SFX).
	 *
	 * @remarks
	 * Utilisé dans PauseScene, MenuScene, GameScene lors des transitions.
	 */
	stopAll() {
		this.scene.sound.stopAll();
		this.currentMusic = undefined;
	}

	/**
	 * Joue un effet sonore simple (pas de loop).
	 *
	 * @param key - Clé du son.
	 * @param volume - Niveau sonore (défaut : `0.2`).
	 *
	 * @example
	 * ```ts
	 * this.sounds.playSfx("coin_pickup", 0.3);
	 * ```
	 */
	playSfx(key: string, volume = 0.2) {
		this.scene.sound.play(key, { volume });
	}
}
