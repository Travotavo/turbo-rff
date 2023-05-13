class ScoreSheet extends Phaser.Scene {
    constructor(){
        super("game_over");
    }
    create(){
        this.flash = this.add.rectangle(0, 0 ,game.config.width, game.config.height, '0x000000').setOrigin(0,0).setDepth(2);
        this.flash.alpha = 0.5;

        keyPress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
    }

    update(){
        if (Phaser.Input.Keyboard.JustDown(keyPress)){
            this.scene.stop('play_state');
            this.scene.start('main_menu');
        }
    }
}