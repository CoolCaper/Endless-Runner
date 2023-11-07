// Endless Runner - Space Rush
// Name: Shauna
// Date: 10/31/2023
//creative tilt - outerspace
/*
https://github.com/CoolCaper/Endless-Runner

https://coolcaper.github.io/Endless-Runner/

Creative Tilt:
I went for an outerspace theme, and I'm most proud of my implementation of the jump code, which made use of both arcade physics and 
delayedCall. And it was all my own!
I also like the way my idea for randomizing terrain turned out :)

So please look at that when grading :D

*/
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
let global_score = 0;
let game = new Phaser.Game(config)

let { width, height } = game.config