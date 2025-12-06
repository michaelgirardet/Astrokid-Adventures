export default class SoundManager {
	private scene: Phaser.Scene;
	private currentMusic?: Phaser.Sound.BaseSound;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;
	}

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

	stopMusic() {
		if (this.currentMusic) {
			this.currentMusic.stop();
			this.currentMusic = undefined;
		}
	}

	stopAll() {
		this.scene.sound.stopAll();
		this.currentMusic = undefined;
	}

	playSfx(key: string, volume = 0.2) {
		this.scene.sound.play(key, { volume });
	}
}
