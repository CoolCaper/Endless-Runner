class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    preload() {
        this.load.path = './assets/'
        this.load.atlas('ship', 'ship/ship.png', 'ship/ship_atlas.json');
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
        this.jump_add_sfx = this.sound.add('jump')
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
        this.obst = this.physics.add.sprite(1050, 450, 'asteroid')
        this.enemy = this.physics.add.sprite(1000, 450, 'Space Kitty')
        this.coin = this.physics.add.sprite(970, 600, 'coin')
        this.score = 0;        
        this.jump_key = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        this.is_jumping = false;        
        this.player.body.setCollideWorldBounds(true)        
        this.scoreText = this.add.text(10, 10, "SCORE: " + this.score, this.scoreConfig);
        this.bgm_music = this.sound.add('music');
        this.coin_music = this.sound.add('coin');
        this.bgm_music.play();
        this.coin_active = false;      
        this.SK_active = false;
        this.asteroid_active = false;
        this.jump_num = 0
        
        this.hit = this.sound.add('hit')
        this.physics.add.collider(this.player, this.obst, (player, obst) => {    
          this.hit.play();
          this.bgm_music.stop();     
          global_score = this.score
          this.scene.start('gameOverScene');

        })
        
        this.physics.add.collider(this.player, this.enemy, (player, enemy) => {    
            this.hit.play();
            this.bgm_music.stop();     
            global_score = this.score
            this.scene.start('gameOverScene');  
          })

        
          this.physics.add.collider(this.player, this.coin, (player, coin) => {    
            this.coin_music.play();  
            this.score += 1000;
            this.coin_active = false;
            this.coin.x = 990;
          })
    }

    update() { 
        //jump command
        //console.log(this.player.y)
        //console.log(this.jump_num)
            if (this.player.y == 480) {
                this.jump_num = 0
            }                  
        if (Phaser.Input.Keyboard.JustDown(this.jump_key) && !this.is_jumping && this.jump_num < 1) {
            this.jump_add_sfx.play();
            this.is_jumping = true;
            this.jump_num++;
            this.player.setVelocityY(-1500);
            this.clock = this.time.delayedCall(200, () => {
                this.player.setVelocityY(225);
                this.clock = this.time.delayedCall(200, () => {
                    this.is_jumping = false;
                }, null, this);
            }, null, this);
        }
        //variables
        this.back.tilePositionX += 10;
        this.score++;
        this.scoreText = this.add.text(10, 10, "SCORE: " + this.score, this.scoreConfig);  
        //obstacle randomizer
        let picker;
        let distance = Math.abs(this.obst.x - this.enemy.x)
        if (this.score % 200 == 0) {
            picker = Phaser.Math.Between(1, 20)
            if (10 < picker && picker <= 15 && !this.SK_active) {
                this.SK_active = true;
            } 
            if (picker > 10 && picker < 17 && !this.coin_active) {
                this.coin_active = true;
                console.log('This should not happen more then once per coin spawned')
                this.coin.y = Phaser.Math.Between(320, 500)
            }            
            if (picker < 5 && !this.asteroid_active) {
                console.log(picker)
                console.log('asteroid active. picker should be less then five')
                this.asteroid_active = true;
            }
            if (picker >= 17) {                
                this.SK_active = true;
                this.asteroid_active = true;
            }
        } 
        /*
        else if (this.score >= 5000 && this.score % 1000 == 0) {            
            picker = Phaser.Math.Between(1, 10)
            if (5 <= picker < 10 && !this.SK_active  && this.score % 250 == 0) {
                this.SK_active = true;
            } 
            if (3 < picker <= 5 && !this.coin_active  && this.score % 50 == 0) {
                this.coin_active = true;
                this.coin.y = 50//Phaser.Math.Between(0, 540)
            }            
            if (1 <= picker <= 3 && this.score % 500 == 0) {
                this.asteroid_active = true;
            }
*/        
        //randomly spawns space kitty obstacle
        if (this.SK_active) {
            this.enemy.x -= 8;
        }
        if (this.enemy.x < 0) {
            this.SK_active = false;
            this.enemy.x = 1000;
        }

        //randomly spawns asteroid obstacle
        if (this.asteroid_active) {
            this.obst.x -= 8;
        }
        if (this.obst.x < 0) {
            this.asteroid_active = false;
            this.obst.x = 1050;
        }
        
        //randomly spawns coin
        if (this.coin_active) {
            this.coin.x -=8;
        }
        if (this.coin.x < 0) {
            this.coin_active = false;
            this.coin.x = 990;
        }
    }
}