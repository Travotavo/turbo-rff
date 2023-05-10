class PlayState extends Phaser.Scene {

    preload(){
        this.load.path = 'assets/sprites/game/';

        this.load.aseprite('turbo', 'fist.png', 'fist.json');
        this.load.image('ui-frame', 'ui.png');
        this.load.image('fuel', 'bar.png');
        this.load.spritesheet('score-screen', 'screen.png', {frameWidth:54, frameHeight: 25, startFrame:0, endFrame:4})
    }

    constructor(){
        super("play_state");
    }

    create(){
        //Player Temp for Scene Setup
        
        this.anims.createFromAseprite('turbo');
        this.player = new Player(this, 'turbo', 0, 'Idle');

        //Key
        keyPress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // UI

        this.fuel = this.add.sprite(176, 265, 'fuel').setOrigin(1,1);
        this.fuel.setCrop(0, 100, 21, 193);

        this.tv = this.add.sprite(2,2, 'score-screen').setOrigin(0,0);
        this.anims.create({
            key: 'flicker',
            frames: this.anims.generateFrameNumbers('score-screen', {start: 0, end: 4, first: 0})
        })

        this.tv.play('flicker');
        this.add.sprite(0, 0, 'ui-frame').setOrigin(0,0);
    }

    update(){
        
    }
}