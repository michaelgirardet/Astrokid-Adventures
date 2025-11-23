import Level from '../core/Level';
import Player from '../entities/Player';
import Star from '../entities/Star';
import Bomb from '../entities/Bomb';
import ScoreUI from '../ui/ScoreUI';
import Enemy from '../entities/EnemyFly';
import Coin from '../entities/Coin';

export default class GameScene extends Phaser.Scene {

    private level!: Level;
    private player!: Player;
    private enemy!: Enemy;
    private stars!: Phaser.Physics.Arcade.Group;
    private bombs!: Phaser.Physics.Arcade.Group;
    private scoreUI!: ScoreUI;
    private coins: Coin;

    constructor() {
        super('Game');
    }

create() {

    this.level = new Level(this);
    this.level.load();

    const spawn = this.level.map.findObject(
    "Objects_Player",
    obj => obj.name === "Player"
)
    this.player = new Player(this, spawn.x!, spawn.y!);
    this.physics.add.overlap(
    this.player,
    this.level.flag,
    this.endLevel,
    undefined,
    this
);

    this.physics.add.collider(this.player, this.level.groundLayer);
    this.physics.add.collider(this.player, this.level.blocksLayer);
    this.level.groundLayer.renderDebug(
    this.add.graphics().setAlpha(0.75),
    {
        tileColor: null,
        collidingTileColor: 0xff0000,
    }
);

    this.cameras.main.setRoundPixels(true);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(
        0,
        0,
        this.level.map.widthInPixels,
        this.level.map.heightInPixels
    );

    this.physics.add.overlap(this.player, this.level.coins, this.collectCoin, undefined, this);
    this.physics.add.collider(this.player, this.level.enemies, this.hitEnemy, undefined, this);
    this.physics.add.overlap(this.player, this.level.flag, this.endLevel, undefined, this);
}

    



    update() {
    this.player.update();
    }

    spawnStars() {
        for (let i = 0; i < 12; i++) {
            const star = new Star(this, 12 + i * 70, 0);
            this.stars.add(star);
        }
    }

    collectStar(player: Player, star: Star) {
        star.disableBody(true, true);
        this.scoreUI.add(100);

        if (this.stars.countActive(true) === 0) {
            this.spawnStars();
            this.spawnBomb();
        }
    }

    spawnBomb() {
        const x = (this.player.x < 400)
            ? Phaser.Math.Between(400, 800)
            : Phaser.Math.Between(0, 400);

        const bomb = new Bomb(this, x, 16);
        this.bombs.add(bomb);

        this.physics.add.collider(this.player, this.bombs, () => {
        console.log('GAME OVER');
        });
    }

    collectCoin(player: Player, coin: any) {
    coin.destroy();
    console.log("Coin collected !");
}

    hitEnemy(player: Player, enemy: any) {
        console.log("Player hit by enemy !");
    }

    endLevel() {
        console.log("LEVEL FINISHED !");
    }
}
