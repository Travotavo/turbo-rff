class Menu extends Phaser.Scene {

    preload(){
        this.load.image('title', './assets/sprites/menus/title.png');
    }

    constructor(){
        super("main_menu");
    }

    create(){
        this.add.sprite(0,0, 'title').setOrigin(0,0);
    }

    update() {
        this.scene.start('play_state');
    }
}