let config = {
    type:Phaser.CANVAS,
    width: 180,
    height: 320,
    zoom: 2,
    pixelArt: true,
    scene: [Menu, Help, PlayState]
}

let game = new Phaser.Game(config);