import Level from "./Level";

export default class PhysicsHelper {
    static addColliders(scene: Phaser.Scene, level: Level, player: Phaser.GameObjects.GameObject) {
        scene.physics.add.collider(player, level.platforms);
    }

    static addOverlap(scene: Phaser.Scene, obj1: any, obj2: any, callback: Function) {
        scene.physics.add.overlap(obj1, obj2, callback as any, undefined, scene);
    }
}
