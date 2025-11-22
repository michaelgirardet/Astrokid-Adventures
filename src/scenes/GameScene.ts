import Level from '../core/Level';
import Player from '../entities/Player';
import Star from '../entities/Star';
import Bomb from '../entities/Bomb';
import ScoreUI from '../ui/ScoreUI';

export default class GameScene extends Phaser.Scene {

    private level!: Level;
    private player!: Player;
    private stars!: Phaser.Physics.Arcade.Group;
    private bombs!: Phaser.Physics.Arcade.Group;
    private scoreUI!: ScoreUI;

    constructor() {
        super('Game');
    }

    create() {
        
    this.level = new Level(this);
    this.level.loadMap();
        
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    bg.setDisplaySize(this.level.width, this.level.height);
    bg.setScrollFactor(0); 
    bg.setDepth(-1)
        
    this.anims.create({
        key: 'walk',
        frames: [
            { key: 'player_walk_a' },
            { key: 'player_walk_b' }
        ],
        frameRate: 4,
        repeat: -1
    });

    this.anims.create({
        key: 'idle',
        frames: [{ key: 'player_idle' }],
        frameRate: 1,
        repeat: -1
    });

    this.anims.create({
        key: 'jump',
        frames: [{ key: 'player_jump' }],
        frameRate: 2
    });

    this.physics.world.setBounds(0, 0, this.level.width, this.level.height);

    this.player = new Player(this, 100, this.level.height - 100);

    this.physics.add.collider(this.player, this.level.platforms);

    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, this.level.width, this.level.height);     
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

        this.physics.add.collider(bomb, this.level.platforms);
        this.physics.add.collider(this.player, this.bombs, () => {
            console.log('GAME OVER');
        });
    }
}
