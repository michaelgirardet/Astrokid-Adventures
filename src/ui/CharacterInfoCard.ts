import Phaser from "phaser";
import type { CharacterStats } from "../data/characterStats";

export default class CharacterInfoCard extends Phaser.GameObjects.Container {
	private bg: Phaser.GameObjects.Rectangle;
	private title: Phaser.GameObjects.Text;
	private desc: Phaser.GameObjects.Text;
	private stats: Phaser.GameObjects.Text;
	private ability: Phaser.GameObjects.Text;
	private style: Phaser.GameObjects.Text;

	constructor(scene: Phaser.Scene, x: number, y: number) {
		super(scene, x, y);

		scene.add.existing(this);

		this.setDepth(10);
		this.setVisible(false);

		this.bg = scene.add
			.rectangle(0, 0, 420, 360, 0x162028, 0.85)
			.setOrigin(0.5)
			.setStrokeStyle(4, 0x446daa);

		this.title = scene.add.text(0, -150, "", {
			fontFamily: "DynaPuff",
			fontSize: "32px",
			color: "#ffffff"
		}).setOrigin(0.5);

		this.desc = scene.add.text(0, -80, "", {
			fontFamily: "Open Sans",
			fontSize: "16px",
			color: "#ffffff",
			wordWrap: { width: 380 }
		}).setOrigin(0.5);

		this.stats = scene.add.text(0, 20, "", {
			fontFamily: "DynaPuff",
			fontSize: "18px",
			color: "#ffffff"
		}).setOrigin(0.5);

		this.ability = scene.add.text(0, 90, "", {
			fontFamily: "Open Sans",
			fontSize: "14px",
			color: "#add7f6",
			wordWrap: { width: 380 }
		}).setOrigin(0.5);

		this.style = scene.add.text(0, 150, "", {
			fontFamily: "DynaPuff",
			fontSize: "16px",
			color: "#ffffff",
			wordWrap: { width: 380 }
		}).setOrigin(0.5);

		this.add([this.bg, this.title, this.desc, this.stats, this.ability, this.style]);
	}

	show(data: CharacterStats) {
		this.title.setText(`👾 ${data.name}`);
		this.desc.setText(data.description);

		const star = (v: number) => "★".repeat(v) + "☆".repeat(5 - v);

		this.stats.setText(
			`Vitesse : ${star(data.speed)}\nSaut : ${star(data.jump)}\nAttaque : ${star(data.attack)}\nCœurs : ${data.hearts}`
		);

		this.ability.setText(`${data.abilityDesc}`);
		this.style.setText(data.style);

		this.setVisible(true);
		this.setAlpha(0);
		this.scene.tweens.add({
			targets: this,
			alpha: 1,
			duration: 150
		});
	}

	hide() {
		this.scene.tweens.add({
			targets: this,
			alpha: 0,
			duration: 150,
			onComplete: () => this.setVisible(false)
		});
	}
}
