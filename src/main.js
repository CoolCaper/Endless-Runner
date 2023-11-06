// Endless Runner
// Name: Shauna
// Date: 10/31/2023
'use strict'

let config = {
    type: Phaser.AUTO,
    width: 960,
    height: 540,
    scene: [Menu, Play, GameOver],
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
}
let game = new Phaser.Game(config)

let { width, height } = game.config