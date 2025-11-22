export default class Level {
    public platforms!: Phaser.Physics.Arcade.StaticGroup;
    public height: number = 1080;       
    public width: number = 1920;

    constructor(private scene: Phaser.Scene) {}

    loadMap() {
        this.platforms = this.scene.physics.add.staticGroup();

        this.platforms.create(400, this.height - 32, 'ground').setScale(2).refreshBody();
        
        // Plateformes
        this.platforms.create(400, 120, 'ground').refreshBody();
        this.platforms.create(750, 300, 'ground').refreshBody();
        this.platforms.create(600, 400, 'ground').refreshBody();
        this.platforms.create(50, 250, 'ground').refreshBody();
        this.platforms.create(600, 200, 'ground').refreshBody();
        this.platforms.create(120, 360, 'ground').refreshBody();
        
        this.platforms.setDepth(10)
    }
}
