class ScoreSheet extends Phaser.Scene {
    constructor(){
        super("game_over");
    }
    create(){
        this.cd = 500;
        this.time = 0;

        this.cover = this.add.rectangle(0, 0 ,game.config.width, game.config.height, '0x000000').setOrigin(0,0);
        this.cover.alpha = 0.5;

        keyPress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);
        console.log(scoringObject);

        let scoreConfig = {
            fontSize: '18px',
            color: '#FFFFFF',
            align: 'left',
            padding: {
                top: 5,
                bottom: 5
            }
        }
        this.iter = 0;
        this.score = scoringObject.Asteroids * 50 + scoringObject.Planets * 300 + scoringObject.Comets * 25 + scoringObject.Meteors * 150;
        this.textArr = [
            this.add.text(game.config.width/8, 25, 'Asteroids: ' + scoringObject.Asteroids, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/4, 50, 'x 50 = ' + + scoringObject.Asteroids * 50, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/8, 75, 'Meteors: ' + scoringObject.Meteors, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/4, 100, 'x 150 = ' + scoringObject.Meteors * 150, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/8, 125, 'Comets: ' + scoringObject.Comets, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/4, 150, 'x 25 = ' + scoringObject.Comets * 25, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/8, 175, 'Planets: ' + scoringObject.Planets, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/4, 200, 'x 300 = ' + scoringObject.Planets * 300, scoreConfig).setOrigin(0, 0.5),
            this.add.text(game.config.width/2, 225, 'SCORE:' + this.score, scoreConfig).setOrigin(0.5, 0.5)
        ]
        for (let i of this.textArr){
            i.visible = false;
        }
    }

    update(time, delta){
        if (Phaser.Input.Keyboard.JustDown(keyPress)){
            this.time = this.cd;
            if (this.iter == this.textArr.length){
                this.scene.stop('play_state');
                this.scene.start('main_menu');
            }
        }
        this.time += 1 * delta;
        if (this.time > this.cd && this.iter < this.textArr.length){
            this.textArr[this.iter].visible = true;
            this.iter += 1;
        }
    }
}