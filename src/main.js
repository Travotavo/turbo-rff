let config = {
    type:Phaser.CANVAS,
    width: 180,
    height: 320,
    zoom: 2,
    backgroundColor: '#000000',
    pixelArt: true,
    scene: [Menu, Help, PlayState]
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