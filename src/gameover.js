class GameOver extends Phaser.Scene {
    constructor() {
        super('gameOverScene')
    }
    preload() {
        // load audio
        this.load.image('retry_button', './assets/retry.png')
        this.load.image('gameOver', './assets/gameover.png')
        this.retry_sfx = this.load.audio('retry_sfx', './assets/219476__jarredgibb__button-05.wav');    
    }

    create() {
        
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

        this.add.tileSprite(0, 0, 960, 500, 'gameOver').setOrigin(0, 0)
        this.retry = this.add.image(480, 400, 'retry_button')
        this.r_s = this.sound.add('retry_sfx')        
        this.scoreTextLabel = this.add.text(350, 460, "FINAL SCORE", this.scoreConfig);
        this.scoreText = this.add.text(350, 500, global_score, this.scoreConfig);  
        this.retry.setInteractive();        
        this.retry.on('pointerdown', () => { 
            this.r_s.play();
            this.scene.start('playScene');
         }); 
    }
    update() {

    }
}
