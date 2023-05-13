class Menu extends Phaser.Scene {

    preload(){
        this.load.image('title', './assets/sprites/menus/title.png');
        this.load.image('tutorial', './assets/sprites/menus/tutorial.png');
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
        this.time = 0
        this.cd = 500;
        keyPress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.title = this.add.sprite(0,0, 'title').setOrigin(0,0);
        this.tutorial = this.add.sprite(0,0, 'tutorial').setOrigin(0,0);
        this.tutorial.alpha = 0;

        let TextConfig = {
            fontSize: '12px',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5
            }
        }

        this.text1 = this.add.text(game.config.width/2, game.config.height/4*3, 'Hold Space for Tutorial', TextConfig).setOrigin(0.5,0.5);
        this.text2 = this.add.text(game.config.width/2, game.config.height/4*3+25, 'Release to Play', TextConfig).setOrigin(0.5,0.5);
        this.pressed = false;
    }

    update(time, delta) {
        if (Phaser.Input.Keyboard.JustDown(keyPress)){
            this.pressed = true;
        }
        if (this.pressed){
            this.time += 1 * delta;
            if (this.time > this.cd){
                this.text1.visible = false;
                this.text2.visible = false;
                this.title.alpha -= .01 * delta;
                this.tutorial.alpha += .01 * delta;
            }
        }
        if (Phaser.Input.Keyboard.JustUp(keyPress)){
            this.scene.start('play_state');
        }
    }
}