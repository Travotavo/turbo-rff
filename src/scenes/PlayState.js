class PlayState extends Phaser.Scene {

    preload(){
        this.load.path = 'assets/sprites/game/';
        this.load.aseprite('turbo', 'fist.png', 'fist.json');
        this.load.image('ui-frame', 'ui.png');
        this.load.image('fuel', 'bar.png');
        this.load.image('warning', 'warning.png');
        this.load.spritesheet('score-screen', 'screen.png', {frameWidth:54, frameHeight: 25, startFrame:0, endFrame:4});
        this.load.image('stars', 'bg/stars.png');
        this.load.image('asteroid', 'enemies/asteroid.png');
        this.load.spritesheet('comet-var1', 'enemies/comet-var1.png', {frameWidth:14, frameHeight: 44, startFrame:0, endFrame:2});
        this.load.spritesheet('planet-var1', 'enemies/planet.png', {frameWidth:180, frameHeight: 277, startFrame:0, endFrame:2});
    }

    constructor(){
        super("play_state");
    }

    create(){
        //Bg setup
        this.starsBG = this.add.tileSprite(0,0, game.config.width, game.config.height, 'stars').setOrigin(0,0);

        //Enemy List + First Enemy
        this.asteroidList = [];
        this.asteroidList[0] = new AsteroidBase(this, game.config.width/2, 150, 'asteroid');
        
        //Animations for enemies
        //Comets
        this.anims.create({
            key: 'comet-1',
            frames: this.anims.generateFrameNumbers('comet-var1', {start: 0, end: 2, first: 0}),
            frameRate: 4,
            repeat: -1
        });
        //Planets
        this.anims.create({
            key: 'planet-1',
            frames: this.anims.generateFrameNumbers('planet-var1', {start: 0, end: 2, first: 0}), 
            frameRate: 4,
            repeat: -1
        });


        //Player Temp for Scene Setup
        this.anims.createFromAseprite('turbo');
        this.player = new Player(this, 0, 'Idle');

        //Key
        keyPress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // UI

        this.tv = this.add.sprite(2,2, 'score-screen').setOrigin(0,0);
        this.anims.create({
            key: 'flicker',
            frames: this.anims.generateFrameNumbers('score-screen', {start: 0, end: 4, first: 0})
        });
        this.tv.setDepth(2);
        this.tv.play('flicker');

        this.add.sprite(0, 0, 'ui-frame').setOrigin(0,0).setDepth(2);

        this.fuel = this.add.sprite(176, 265, 'fuel').setOrigin(1,1);
        this.fuel.setCrop(0, 193 - (this.player.fuel * 193), 21, 193);
        this.fuel.setDepth(2);

        this.warning = this.add.sprite(166, 86, 'warning').setDepth(2);
        this.warning.visible = false;

        //Game Vars
        this.flightSpeed = 1;
    }

    update(time, delta){
        this.starsBG.tilePositionY -= 1/delta * this.flightSpeed;

        this.player.update(delta);

        if (this.asteroidList.length == 0){
            this.asteroidList.push(new Planet(this, game.config.width/2, 0, 'planet-var1'));
        }
        for (let i of this.asteroidList){
            i.update(delta, this.flightSpeed);
        }

        if (this.player.fuelCheck()){
            this.warning.visible = false;
        }
        else {
            this.warning.visible = true;
        }
    }

    fuelRefresh(){
        this.fuel.setCrop(0, 193 - (this.player.fuel * 193), 21, 193);
    }

    getAsteroids(){
        return this.asteroidList;
    }

    addAsteroid(incoming){
        this.asteroidList.push(incoming);
    }

    killAsteroid(asteroid){
        let target = this.asteroidList.indexOf(asteroid);
        if (target > -1){
            this.asteroidList.splice(target, 1);
        }
    }
}