import type HeartUI from "../ui/HeartUI";
import HUD from "../ui/HUD";
import type ScoreUI from "../ui/ScoreUI";
import type StarUI from "../ui/StarUI";

/**
 * Gère l'accès à toutes les interfaces du HUD :
 * - Coeurs (vie)
 * - Score
 * - Étoiles collectées
 * - Messages d’aide (hint)
 *
 * @remarks
 * UIManager sert d'abstraction : le GameScene ne manipule jamais directement
 * les composants UI internes (HeartUI, ScoreUI, StarUI…),
 * mais passe toujours par ce manager.
 *
 * Cela permet de changer facilement l’implémentation visuelle sans toucher à la logique du jeu.
 */
export default class UIManager {
	private hud: HUD;

	/**
	 * Initialise le HUD et tous ses composants.
	 *
	 * @param scene - La scène Phaser où l'UI doit s'afficher.
	 */
	constructor(scene: Phaser.Scene) {
		this.hud = new HUD(scene);
	}

	/**
	 * Accès au gestionnaire d’affichage des cœurs (points de vie).
	 */
	get hearts(): HeartUI {
		return this.hud.getHearts();
	}

	/**
	 * Accès au gestionnaire d’affichage du score du joueur.
	 */
	get score(): ScoreUI {
		return this.hud.getScore();
	}

	/**
	 * Accès au gestionnaire d’affichage du nombre d’étoiles collectées.
	 */
	get stars(): StarUI {
		return this.hud.getStars();
	}

	/**
	 * Accès au composant affichant des messages d’aide
	 * (ex : "Appuyez sur ESPACE pour lancer la brique").
	 */
	get hint() {
		return this.hud.getHint();
	}
}
