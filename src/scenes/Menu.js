class Menu extends Phaser.Scene {

    preload(){
        this.load.image('title', './assets/sprites/menus/title.png');
        this.load.audio('game_bgm', './assets/sounds/trff_bgm.wav');
    }

    constructor(){
        super("main_menu");
    }

    create(){
        keyPress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        this.add.sprite(0,0, 'title').setOrigin(0,0);
    }

    update() {
        if (Phaser.Input.Keyboard.JustUp(keyPress)){
            this.scene.start('play_state');
        }
    }
}