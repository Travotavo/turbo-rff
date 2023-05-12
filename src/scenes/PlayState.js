class PlayState extends Phaser.Scene {

    preload(){
        this.load.path = 'assets/sprites/game/';
        this.load.aseprite('turbo', 'fist.png', 'fist.json');
        this.load.atlas('particles', 'particles.png', 'particles.json');
        this.load.image('ui-frame', 'ui.png');
        this.load.image('fuel', 'bar.png');
        this.load.image('warning', 'warning.png');
        this.load.spritesheet('score-screen', 'screen.png', {frameWidth:54, frameHeight: 25, startFrame:0, endFrame:4});
        this.load.image('stars', 'bg/stars.png');
        this.load.image('asteroid', 'enemies/asteroid.png');
        this.load.image('meteor', 'enemies/meteor.png');
        this.load.spritesheet('comet-var1', 'enemies/comet-var1.png', {frameWidth:14, frameHeight: 44, startFrame:0, endFrame:2});
        this.load.spritesheet('planet-var1', 'enemies/planet.png', {frameWidth:180, frameHeight: 277, startFrame:0, endFrame:2});
    }

    constructor(){
        super("play_state");
        this.cd = 0;
        this.spawnCD = 0;
        this.increment = 10000;
        this.difficulty = 1;
        this.planetPresent = false;

        this.tCRS = this.hex2rgbArr('0x9944AA');
        this.tCRE = this.hex2rgbArr('0x000000');
        this.bCRS = this.hex2rgbArr('0x4488aa');
        this.bCRE = this.hex2rgbArr('0x9944AA');
    }

    // Color Lerp Logic based on code here: https://codepen.io/njmcode/pen/NWdYBy

    hex2rgbArr(hex){
        hex = hex.split('0x');
        let rgb = [
            parseInt(hex[1].substring(0,2), 16),
            parseInt(hex[1].substring(2,4), 16),
            parseInt(hex[1].substring(4,6), 16)
        ]
        return rgb;
    }

    lerpColor(rgb1,rgb2, percent = 0.5){
        let result = [];
        let k = 0
        for (let i of rgb1){
            result[k] = Math.round(i + percent * (rgb2[k] - i));
            k++;
        }
        return result;
    }

    rgbArr2hex(rgb){
        let result = '0x'+ rgb[0].toString(16) + rgb[1].toString(16) + rgb[2].toString(16);
        return result;
    }


    create(){
        this.bgm = this.sound.add('game_bgm', {volume: 0.25});
        this.bgm.play();
        //Bg setup
        this.skyRects = [];
        let k = game.config.height;
        let temp = 0;
        let scalingColor1 = this.hex2rgbArr('0x9944AA');
        let scalingColor2 = this.hex2rgbArr('0x4488aa');
        
        for (let i = 0; i < 6; i++){
            let lerpedColor = this.lerpColor(scalingColor1, scalingColor2, 1/6 * i);
            this.skyRects.push(this.add.rectangle(game.config.width/2, temp - 10, game.config.width, k/2, this.rgbArr2hex(lerpedColor)).setOrigin(0.5,0));
            k = k/2;
            temp += k;
        }
        this.starsBG = this.add.tileSprite(0,0, game.config.width, game.config.height, 'stars').setOrigin(0,0);

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
        
        //Enemy List + First Enemy
        this.asteroidList = [];

        //Player Temp for Scene Setup
        this.anims.createFromAseprite('turbo');
        this.player = new Player(this, 0, 'Idle');

        //Particle Setup
        // 0 is metal
        // 1 is rock
        // 2 is comet
        let emitterSettings = {
            frame: [0],
            lifespan: 1500,
            speedX: { min: -100, max: 100 },
            speedY: { min: -200, max: -150 },
            gravityY: 600,
            emitting: false
        }
        this.emitterMetal = this.add.particles(game.config.width/2, game.config.height/4 * 3, 'particles', emitterSettings);
        emitterSettings.frame = [1];
        this.emitterRock = this.add.particles(game.config.width/2, game.config.height/4 * 3, 'particles', emitterSettings);
        emitterSettings.frame = [2];
        this.emitterSparkle = this.add.particles(game.config.width/2, game.config.height/4 * 3, 'particles', emitterSettings);
        
        //Key
        keyPress = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Z);

        // UI

        this.flash = this.add.rectangle(0, 0 ,game.config.width, game.config.height, '0xFFFFFF').setOrigin(0,0).setDepth(2);
        this.flash.alpha = 0;

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

        this.starsBG.tilePositionY -= 2/delta * this.flightSpeed * this.flightSpeed;

        this.player.update(delta);

        this.cd += 1 * delta;
        if (this.cd > this.increment){
            this.cd = 0;
            this.difficulty += 1;
            this.increment += this.increment/2;
            this.updateBG();
        }
        if (!this.planetPresent){
            if (!this.bgm.isPlaying){
                this.musicFinished = false;
                this.bgm.play();
            }
            this.spawnCD += 1 * delta;
            if (this.asteroidList.length < 1 && this.spawnCD > 500){
                this.spawnCD = 0;
                this.difficultySpawn();
            }
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

    difficultySpawn(){
        
        let selection = Math.floor(Math.random() * Math.min(4, this.difficulty));
        switch(selection){
            case 3: // Spawn Planet
                this.addAsteroid(new Planet(this, game.config.width/2, -50, 'planet-var1'));
                return;
            case 2: // Spawn Comet
                this.addAsteroid(new Comet(this, game.config.width/2, -10, 'comet-var1', 2));
                return;
            case 1: // Spawn Meteor
                this.addAsteroid(new Meteor(this, game.config.width/2, 0, 'meteor', 2));
                return;
            case 0:
                this.addAsteroid(new AsteroidBase(this, game.config.width/2, 0, 'asteroid'));
                return;
        }
    }

    updateBG(){
        let diffScale = 1/10 * this.difficulty;
        let topColor = this.lerpColor(this.tCRS, this.tCRE, diffScale);
        let botColor = this.lerpColor(this.bCRS, this.bCRE, diffScale);
        //let scalingColor2 = this.hex2rgbArr('0x4488aa');
        for (let i = 0; i < 6; i++){
            let lerpedColor = this.lerpColor(topColor, botColor, 1/8 * i);
            this.skyRects[i].fillColor = this.rgbArr2hex(lerpedColor);
        }
    }

    killAsteroid(asteroid){
        let target = this.asteroidList.indexOf(asteroid);
        if (target > -1){
            this.asteroidList.splice(target, 1);
        }
    }
}