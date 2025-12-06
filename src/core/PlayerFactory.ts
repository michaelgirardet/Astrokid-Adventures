import type PlayerBase from "../entities/Player";
import PlayerYellow from "../entities/players/PlayerYellow";

export function createPlayer(
	scene: Phaser.Scene,
	x: number,
	y: number,
	id: string,
): PlayerBase {
	switch (id) {
		case "yellow":
			return new PlayerYellow(scene, x, y);
		// case "green":
		// 	return new PlayerGreen(scene, x, y);
		// case "purple":
		// 	return new PlayerPurple(scene, x, y);
		default:
			console.warn(`Unknown player type "${id}". Using yellow.`);
			return new PlayerYellow(scene, x, y);
	}
}
