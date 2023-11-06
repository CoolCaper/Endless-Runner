class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/'
        this.load.atlas('ship', 'blinking_ship2/blinking_ship2.png', 'blinking_ship2/blinking_ship2_atlas.json');
        //this.load.image('ship', 'spaceship2Flip3.png')
        this.load.image('bg', 'sky.png')
        this.load.image('Space Kitty', 'Space Kitty.png')
        this.load.image('asteroid', 'asteroid.png')
        this.load.image('coin', 'coin.png')
        this.bgm = this.load.audio('music', 'abstract-world-127012.mp3');
        this.coin_sfx = this.load.audio('coin', '402766__matrixxx__retro-coin-04.wav');
        this.hit_sfx = this.load.audio('hit', '527529__jerimee__startled-fall.wav');
        this.jump_sfx = this.load.audio('jump', '503461__matrixxx__retro-jump-04.wav');
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
        this.coin = this.physics.add.sprite(970, 600, 'coin')
        this.enemy = this.physics.add.sprite(500, 450, 'Space Kitty')
        this.obst = this.physics.add.sprite(990, 600, 'asteroid')
        this.score = 0;        
        this.jump_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.is_jumping = false;        
        this.player.body.setCollideWorldBounds(true)        
        this.scoreText = this.add.text(10, 10, "SCORE: " + this.score, this.scoreConfig);
        this.bgm_music = this.sound.add('music');
        this.bgm_music.play();
    }

    update() { 
        //jump command
        if (Phaser.Input.Keyboard.JustDown(this.jump_key) && !this.is_jumping) {
            this.jump_sfx.play();
            this.is_jumping = true;
            this.player.setVelocityY(-1000);
            this.clock = this.time.delayedCall(200, () => {
                this.player.setVelocityY(1000);
                this.clock = this.time.delayedCall(200, () => {
                    this.is_jumping = false;                    
                }, null, this);
            }, null, this);
        }
        //variables
        this.back.tilePositionX += 10;
        this.score++;
        this.scoreText = this.add.text(10, 10, "SCORE: " + this.score, this.scoreConfig);        
        SK_active = false;
        asteroid_active = false;
        coin_active = false;
        //obstacle randomizer
        if (this.score < 10000) {
            picker = Phaser.Math.Betwee(1, 20)
            if (10 < picker < 15) {
                SK_active = true;
            } 
            if (9 <= picker <= 14) {
                coin_active = true;
                this.coin.y = Phaser.Math.Between(500, 550)
            }            
            if (15 <= picker <= 20) {
                asteroid_active = true;
            }
        } else {            
            picker = Phaser.Math.Betwee(1, 10)
            if (5 <= picker < 10) {
                SK_active = true;
            } 
            if (3 < picker <= 5) {
                coin_active = true;
                this.coin.y = Phaser.Math.Between(500, 550)
            }            
            if (1 <= picker <= 3) {
                asteroid_active = true;
            }

        }        
        //randomly spawns space kitty obstacle
        if (SK_active) {
            this.enemy.x -= 4;
        }
        if (this.enemy.x < 0) {
            SK_active = false;
            this.enemy.x = 500;
        }

        //randomly spawns asteroid obstacle
        if (asteroid_active) {
            this.obst.x -= 4;
        }
        if (this.obst.x < 0) {
            asteroid_active = false;
            this.obst.x = 500;
        }
        
        //randomly spawns coin
        if (coin_active) {
            this.coin.x -=4;
        }
        if (this.coin.x < 0) {
            coin_active = false;
            this.coin.x = 500;
        }
    }
}