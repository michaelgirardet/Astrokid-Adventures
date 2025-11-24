import Level from '../core/Level';
import Player from '../entities/Player';
import Star from '../entities/Star';
import Bomb from '../entities/Bomb';
import ScoreUI from '../ui/ScoreUI';
import Coin from '../entities/Coin';
import EnemyFly from '../entities/enemies/EnemyFly';
import EnemyBlob from '../entities/enemies/EnemyBlob';
import HeartUI from '../ui/HeartUI';
import HUD from '../ui/HUD';

export default class GameScene extends Phaser.Scene {

    private level!: Level;
    private player!: Player;
    private stars!: Phaser.Physics.Arcade.Group;
    private bombs!: Phaser.Physics.Arcade.Group;
    private scoreUI!: ScoreUI;
    private heartUI!: HeartUI;
    private hud!: HUD;

    constructor() {
        super('Game');
    }

create() {

    // --- LOAD LEVEL ---
    this.level = new Level(this);
    this.level.load();

    this.hud = new HUD(this);

    this.heartUI = this.hud.getHearts();
    this.scoreUI = this.hud.getScore();

    
    // --- PLAYER SPAWN ---
    const spawn = this.level.map.findObject("Objects_Player", obj => obj.name === "Player");
    this.player = new Player(this, spawn.x!, spawn.y!);
    
    // --- BOMBS GROUP ---
    this.bombs = this.physics.add.group();

    // --- COINS ---
    this.level.coins = this.physics.add.group();
    const coinObjects = this.level.map.getObjectLayer("Objects_Coins").objects;
    coinObjects.forEach(obj => {
        const coin = new Coin(this, obj.x!, obj.y!);
        this.level.coins.add(coin);
    });

    // --- ENEMIES ---
   const enemyObjects = this.level.map.getObjectLayer("Objects_Enemies").objects;

    enemyObjects.forEach(obj => {

    const x = obj.x!;
    const y = obj.y! - (obj.height || 32);

    // Lire TOUTES les custom props
    const props: any = {};
    obj.properties?.forEach((p: any) => {
        props[p.name] = p.value;
    });

    const type = props.type;

        let enemy;
        
        this.physics.add.overlap(
    this.player,
    this.level.enemies,
    this.hitEnemyFromAbove,
    this.checkIfAbove,
    this
        );
        

    switch (type) {
        case "fly":
            enemy = new EnemyFly(this, x, y, props);
            break;
        case "blob":
            enemy = new EnemyBlob(this, x, y, props);
            break;
        default:
            console.warn("Unknown enemy type:", type);
            return;
    }

    this.level.enemies.add(enemy);
});



    // --- STARS ---
    this.stars = this.physics.add.group();
    const starObjects = this.level.map.getObjectLayer("Objects_Stars").objects;
    starObjects.forEach(obj => {
        const star = new Star(this, obj.x!, obj.y!);
        this.stars.add(star);
    });

    // --- FLAG ---
    const flagObj = this.level.map.findObject("Objects_Flag", obj => obj.name === "Flag");
    // this.level.flag = this.physics.add.staticImage(flagObj.x!, flagObj.y!, "flag");

    // --- COLLISIONS ---
    this.physics.add.collider(this.player, this.level.groundLayer);
    this.physics.add.collider(this.player, this.level.blocksLayer);
    this.physics.add.collider(this.player, this.level.enemies, this.hitEnemy, undefined, this);

    // --- ENEMY COLLISIONS ---
    this.physics.add.collider(this.level.enemies, this.level.groundLayer);
    this.physics.add.collider(this.level.enemies, this.level.blocksLayer);

    // --- OVERLAPS ---
    this.physics.add.overlap(this.player, this.level.coins, this.collectCoin, undefined, this);
    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);
    this.physics.add.overlap(this.player, this.level.flag, this.endLevel, undefined, this);

    // --- CAMERA ---
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, this.level.map.widthInPixels, this.level.map.heightInPixels);
}
    
   update(time: number, delta: number) {
    this.player.update(time, delta);

    this.level.enemies.children.each((enemy: any) => {
        if (enemy.update) {
            enemy.update(time, delta);
        }
    });
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
    
    checkIfAbove(player: Player, enemy: Phaser.Physics.Arcade.Sprite) {
    return player.body.velocity.y > 0;  // joueur est en train de tomber
    }
    
    hitEnemyFromAbove(player: Player, enemy: any) {
    // Tuer l'ennemi
    enemy.destroy();

    // Rebond du joueur
    player.setVelocityY(-500);

    // Bonus sonore / particules = possible
}

hitEnemy(player: Player, enemy: any) {

    // Si le joueur tombe sur l'ennemi → ne pas prendre de dégât
    if (player.body.velocity.y > 0) return;

    // Si invincible → ignorer
    if (player.isInvincible) return;

    // Activer l'invincibilité
    player.isInvincible = true;
    player.invincibleTimer = 1000; // ms
    player.setTint(0xff5555);
    player.setAlpha(0.5);

    this.heartUI.loseHeart();

    if (this.heartUI.getHearts() <= 0) {
        console.log("GAME OVER");
        this.scene.restart();
    }
}

    endLevel() {
        console.log("LEVEL FINISHED !");
    }
}
