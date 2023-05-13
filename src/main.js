/*
* Code by Travis Carlen
*
* Turbo Rocket Flyer Fist (T.R.F.F for short)
*
* Project time including Art, 16 Hours
*
* Made use of a State Machine Structure within Player.js, used to track cooldowns, putting more consequence onto missing a button press.
* Additionally, had to learn how the math for lerp and gradients work for the bg.
*
* Style-wise, I tried to keep the entire game limited to 1 input method, as show by the way you must interect with the menu. Actually really 
* proud of the music and art this time around.
*
*/

let config = {
    type:Phaser.CANVAS,
    width: 180,
    height: 320,
    zoom: 2,
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [Menu, PlayState, ScoreSheet]
}

let game = new Phaser.Game(config);
let scoringObject = {
    Asteroids: 0,
    Comets: 0,
    Meteors: 0,
    Planets: 0,
    HighestCombo: 0,
    Bonus: 0
}
let keyPress;