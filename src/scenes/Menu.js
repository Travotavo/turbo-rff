class Menu extends Phaser.Scene {

    preload(){
        this.load.image('title', './assets/sprites/menus/title.png');
        this.load.audio('game_bgm', './assets/sounds/trff_bgm.wav');
        this.load.audio('sfx_asteroid', './assets/sounds/rock_blast.wav');
        this.load.audio('sfx_meteor', './assets/sounds/metal_plink.wav');
        this.load.audio('sfx_comet', './assets/sounds/fade.wav');
        this.load.audio('sfx_planet', './assets/sounds/rumble.wav');
        this.load.audio('sfx_turbo', './assets/sounds/turbo.wav');
        
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