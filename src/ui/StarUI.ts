export default class StarUI {
	private scene: Phaser.Scene;
	private icon: Phaser.GameObjects.Image;
	private text: Phaser.GameObjects.Text;

	private count: number = 0;

	constructor(scene: Phaser.Scene) {
		this.scene = scene;

		// Icône de la star dans le HUD
		this.icon = scene.add.image(160, 40, "Star");
		this.icon.setScrollFactor(0);
		this.icon.setScale(1);
		this.icon.setDepth(1000);

		// Texte du nombre d'étoiles
		this.text = scene.add.text(190, 28, "0", {
			fontFamily: "DynaPuff",
			fontSize: "32px",
			color: "#ffffff",
			stroke: "#162028",
			strokeThickness: 6,
		});
		this.text.setScrollFactor(0);
		this.text.setDepth(1000);
	}

	/** Appelé lorsque le joueur ramasse une étoile */
	addStar() {
		this.count += 1;
		this.text.setText(this.count.toString());
	}

	/** Utilisé par le HUD pour repositionner l’UI */
	setPosition(x: number, y: number) {
		// Position du groupe (centre)
		const baseX = x;
		const baseY = y;

		// Icône étoile
		this.icon.setPosition(baseX, baseY);

		// Texte du nombre
		this.text.setPosition(baseX + 32, baseY - 12);
	}

	getStars() {
		return this.count;
	}
}
