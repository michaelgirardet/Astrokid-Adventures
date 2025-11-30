export default class HintUI {
	private scene: Phaser.Scene;
	private text: Phaser.GameObjects.Text;
	private visibleTimer?: Phaser.Time.TimerEvent;
	private alreadyShown = false;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;

		this.text = scene.add
			.text(scene.cameras.main.width / 2, scene.cameras.main.height / 2, "", {
				fontFamily: "DynaPuff",
				fontSize: "24px",
				color: "#ecd043ff",
				stroke: "#000000",
				strokeThickness: 4,
			})
			.setOrigin(0.5)
			.setScrollFactor(0)
			.setDepth(2000)
			.setAlpha(0);
	}

	show(message: string, duration: number = 2500) {
		if (this.alreadyShown) return;
		this.alreadyShown = true;

		this.text.setText(message);

		// Si un timer était encore actif, on l’annule
		if (this.visibleTimer) {
			this.visibleTimer.remove(false);
		}

		// Fade-in
		this.scene.tweens.add({
			targets: this.text,
			alpha: 1,
			duration: 300,
			ease: "Quad.easeOut",
		});

		// Auto hide après X secondes
		this.visibleTimer = this.scene.time.delayedCall(duration, () => {
			this.hide();
		});
	}

	// Fade-Out
	hide() {
		this.scene.tweens.add({
			targets: this.text,
			alpha: 0,
			duration: 400,
			ease: "Quad.easeIn",
		});
	}
}
