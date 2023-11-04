class play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/'
        this.load.atlas('ship', './blinking_ship2/blinking_ship2.png', './blinking_ship2/blinking_ship2_atlas.json');
        this.load.image('bg', 'sky.png')
        this.load.image('Space Kitty', 'Space Kitty.png')
        this.load.image('asteroid', 'asteroid.png')
        this.load.image('coin', 'coin.png')
        this.bgm = this.load.audio('music', 'abstract-world-127012.mp3');
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#0000FF',
            align: 'left',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 300
          }
    }

    create() {        
        this.back = this.add.tileSprite(0, 0, 960, 540, 'bg').setOrigin(0, 0)
        this.back.fixedToCamera = true;
        this.player = this.physics.add.sprite(90, 500, 'ship')
        this.player.anims.create({
            key: 'blink',
            frames: this.anims.generateFrameNames('ship', { prefix: 'ship_', start: 1, end: 2 }),
            frameRate: 2,
            repeat: -1
        });
        this.player.play('blink');
        this.coin = this.add.image(970, 600, 'coin')
        this.enemy = this.add.image(500, 450, 'Space Kitty')
        this.obst = this.add.image(990, 600, 'asteroid')
        this.score = 0;        
        this.jump_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.is_jumping = false;        
        this.player.body.setCollideWorldBounds(true)        
        this.scoreText = this.add.text(10, 10, "SCORE: " + this.score, this.scoreConfig);
        this.bgm_music = this.sound.add('music');
        this.bgm_music.play();
    }

    update() {
        this.back.tilePositionX += 10;
        this.score++;
        this.scoreText = this.add.text(10, 10, "SCORE: " + this.score, this.scoreConfig);
        if (Phaser.Input.Keyboard.JustDown(this.jump_key) && !this.is_jumping) {
            this.is_jumping = true;
            this.player.setVelocityY(-1000);
            this.clock = this.time.delayedCall(200, () => {
                this.player.setVelocityY(1000);
                this.clock = this.time.delayedCall(200, () => {
                    this.is_jumping = false;                    
                }, null, this);
            }, null, this);
        }
    }
}