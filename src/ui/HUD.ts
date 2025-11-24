import HeartUI from "./HeartUI";
import ScoreUI from "./ScoreUI";

export default class HUD {
    private heartUI: HeartUI;
    private scoreUI: ScoreUI;

    constructor(scene: Phaser.Scene) {
        this.heartUI = new HeartUI(scene, 3);
        this.scoreUI = new ScoreUI(scene);
    }

    getHearts() { return this.heartUI; }
    getScore() { return this.scoreUI; }
}
