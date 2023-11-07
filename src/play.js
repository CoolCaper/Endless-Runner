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
        
          
        this.scoreConfig2 = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#0000FF',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 600
          }
    
          this.scoreConfig3 = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#FFFFFF',
            color: '#0000FF',
            align: 'center',
            padding: {
              top: 5,
              bottom: 5,
            },
            fixedWidth: 900
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
        this.coin_y = 0;
        this.hit = this.sound.add('hit')
        this.physics.add.collider(this.player, this.obst, (player, obst) => {    
          this.hit.play();
          this.bgm_music.stop();     
          global_score = this.score
          this.scene.start('gameOverScene');

        })
        
        this.physics.add.collider(this.player, this.enemy, (player, enemy) => { 
            this.bgm_music.stop();   
            this.hit.play();     
            global_score = this.score
            this.scene.start('gameOverScene');  
          })

        
          this.physics.add.collider(this.player, this.coin, (player, coin) => {    
            this.coin_music.play();  
            this.score += 250;
            this.coin_active = false;
            this.coin.x = 990;
          })
          
            
        this.instructions = this.add.text(200, 140, "Tap the up key to jump!", this.scoreConfig2); 
        this.instructions2 = this.add.text(100, 190, "If you tap the up key again while\ndescending from your first jump", this.scoreConfig3);        
        this.instructions3 = this.add.text(200, 260, "You will double jump!", this.scoreConfig2); 

    }

    update() { 
        //jump command
        //console.log(this.player.y)
        //console.log(this.jump_num)
        if (this.score == 150) {
            this.instructions.setText('Dodge anything that comes at you\nbut collect the pink coins!')
            this.instructions2.destroy()
            this.instructions3.destroy()
        }
        if (this.score == 300) {
            this.instructions.destroy()
        }
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
        let distance = Math.abs(this.coin.x - this.enemy.x)
        let distance2 = Math.abs(this.coin.x - this.obst.x) //I originally wanted to have it be so that coins could spawn ontop of enemies
        //necessitating cleverly timed double jumps to obtain them. Unfortunately this created a strange glitch where if the coins and
        //the obstacles were overlapping a certain way the ship would fly to the cieling and stay there
        if (this.score % 200 == 0 && this.score < 5000) {
            picker = Phaser.Math.Between(1, 20)
            if (10 < picker && picker <= 15 && !this.SK_active) {
                this.SK_active = true;
            } 
            if (picker > 5 && picker < 17 && !this.coin_active) {
                this.coin_active = true;
                this.coin_y = Phaser.Math.Between(200, 300)
            }            
            if (picker <= 5 && !this.asteroid_active) {
                console.log(picker)
                console.log('asteroid active. picker should be less then five')
                this.asteroid_active = true;
            }
            if (picker > 18 && !this.SK_active && !this.asteroid_active) {                
                this.SK_active = true;
                this.asteroid_active = true;
            }
        } else if (this.score % 75 == 0 && this.score >= 5000) {            
            picker = Phaser.Math.Between(1, 20)
            if (10 < picker && picker <= 20 && !this.SK_active) {
                this.SK_active = true;
            } 
            if (picker >= 5 && picker <= 10 && !this.coin_active) {
                this.coin_active = true;
                this.coin_y = Phaser.Math.Between(300, 500)
            }            
            if (picker <= 5 && !this.asteroid_active) {
                console.log(picker)
                console.log('asteroid active. picker should be less then five')
                this.asteroid_active = true;
            }
            if (picker > 18 && !this.SK_active && !this.asteroid_active) {                
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
            this.coin.y = this.coin_y
        }
        if (this.coin.x < 0) {
            this.coin_active = false;
            this.coin.x = 990;
        }
        console.log('Coin Y Pos:', this.coin.y)
        
        console.log('SK Y Pos:', this.enemy.y)
        console.log('Asteroid Y Pos:', this.obst.y)
    }
}