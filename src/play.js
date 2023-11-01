class play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/'
        this.load.image('ship', 'spaceship2Flip3.png')
        this.load.image('bg', 'sky.png')
    }

    create() {        
        this.back = this.add.tileSprite(0, 0, 960, 540, 'bg').setOrigin(0, 0)
        this.back.fixedToCamera = true;
        this.player = this.add.image(90, 500, 'ship')
    }

    update() {
        this.back.x += 20;
    }
}