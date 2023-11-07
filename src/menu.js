class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.image('start_button', './assets/StartButton.png')
        this.load.image('start_scr', './assets/title.png')
        this.start_sfx = this.load.audio('start_sfx', './assets/219476__jarredgibb__button-05.wav');    
    }
    create() {
        let menuConfig = {
          fontFamily: 'Courier',
          fontSize: '28px',
          backgroundColor: '#F3B141',
          color: '#843605',
          align: 'right',
          padding: {
            top: 5,
            bottom: 5,
          },
          fixedWidth: 0
        } 
        this.start_noise = this.sound.add('start_sfx')
        this.start_screen = this.add.tileSprite(0, 0, 960, 500, 'start_scr').setOrigin(0, 0)
        this.start = this.add.image(450, 400, 'start_button')  
        this.start.setInteractive();
        this.start.on('pointerdown', () => { 
          this.start_noise.play();
          this.scene.start('playScene');
        }); 
    }
        update() {
        }
    }
    