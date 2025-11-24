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
import StarUI from '../ui/StarUI';

export default class GameScene extends Phaser.Scene {

    private level!: Level;
    private player!: Player;
    private stars!: Phaser.Physics.Arcade.Group;
    private bombs!: Phaser.Physics.Arcade.Group;
    private scoreUI!: ScoreUI;
    private heartUI!: HeartUI;
    private starUI!: StarUI;
    private hud!: HUD;
    private gameMusic!: Phaser.Sound.BaseSound;
    private hitSound!: Phaser.Sound.BaseSound;
    private jumpSound!: Phaser.Sound.BaseSound;
    private disappearSound!: Phaser.Sound.BaseSound;
    private coinSound!: Phaser.Sound.BaseSound;
    private starSound!: Phaser.Sound.BaseSound;

    constructor() {
        super('Game');
    }

create() {

    // --- LOAD LEVEL ---
    this.level = new Level(this);
    this.level.load();
    this.physics.world.TILE_BIAS = 60;

    this.hud = new HUD(this);

    this.starUI = this.hud.getStars();
    this.heartUI = this.hud.getHearts();
    this.scoreUI = this.hud.getScore();

    // Musique
    this.gameMusic = this.sound.add("game_music", {
    volume: 0.2,
    loop: true
});
    this.gameMusic.play();

    this.hitSound = this.sound.add("hit_sound", { volume: 0.2 });
    this.jumpSound = this.sound.add("jump_sound", { volume: 0.2 });
    this.disappearSound = this.sound.add("disappear_sound", { volume: 0.2 });
    this.coinSound = this.sound.add("coin_sound", { volume: 0.2 });
    this.starSound = this.sound.add("star_sound", { volume: 0.2 });

    
    
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

      this.physics.add.overlap(
        this.player,
        this.level.enemies,
        this.hitEnemyFromAbove,
        this.checkIfAbove,
        this
        );


    // --- STARS ---
    this.stars = this.physics.add.group();
    const starObjects = this.level.map.getObjectLayer("Objects_Stars").objects;
    starObjects.forEach(obj => {
        const star = new Star(this, obj.x!, obj.y!);
        this.stars.add(star);
    });

    // --- FLAG ---
    this.physics.add.overlap(this.player, this.level.flag, this.endLevel, undefined, this);

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

        this.starUI.addStar();
        this.starSound.play();

    this.scoreUI.add(1000);

    if (this.stars.countActive(true) === 0) {
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
        this.scoreUI.add(100);
        this.coinSound.play();

    }
    
   checkIfAbove(player, enemy) {
    const playerBottom = player.body.y + player.body.height;
    const enemyTop = enemy.body.y;

    return (
        player.body.velocity.y > 0 &&  // il tombe
        playerBottom <= enemyTop + 10  // il vient par dessus (marge de sécurité)
    );
}
    
    hitEnemyFromAbove(player: Player, enemy: any) {
    // Tuer l'ennemi
        enemy.destroy();
        this.disappearSound.play();

    // Rebond du joueur
    player.setVelocityY(-500);
}

hitEnemy(player: Player, enemy: any) {

    // Si le joueur tombe sur l'ennemi → ne pas prendre de dégât
    if (player.body.velocity.y > 0) return;
    if (player.isInvincible) return;

    this.hitSound.play();

    // Activer l'invincibilité
    player.isInvincible = true;
    player.invincibleTimer = 1000;
    player.setTint(0xff5555);
    player.setAlpha(0.5);

    this.heartUI.loseHeart();

    if (this.heartUI.getHearts() <= 0) {
        console.log("GAME OVER");
        this.scene.restart();
        this.gameMusic.stop();
    }
}
    endLevel() {
        console.log("LEVEL FINISHED !");
        this.gameMusic.stop();
    }
}
