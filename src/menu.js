class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }
    preload() {
        // load audio
        this.load.image('start_button', './assets/Start_Button.png')
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
        this.add.image(40, 40, 'start_button')

    }
        update() {
          this.scene.start('playScene');    
        }
    }
    