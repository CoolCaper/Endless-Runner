class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.image('start_button', './assets/StartButton.png')
        this.start_sfx = this.load.audio('start_sfx', '219476__jarredgibb__button-05.wav');          
        this.start = this.add.image(40, 40, 'start_button')  
        this.start.setInteractive();
        this.start.on('pointerdown', () => { 
          this.start_sfx.play();
          this.scene.start('playScene');
        }); 
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

    }
        update() {
        }
    }
    