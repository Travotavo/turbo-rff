class Planet extends AsteroidBase {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture, 0);
        scene.planetPresent = true;
        this.play('planet-1');
        this.setOrigin(0.5, 1);
        scene.add.existing(this);
        this.setDepth(1);
        this.scene = scene;
        this.damage = 2;
        this.cd = 0;
        this.soundOnce = false;
    }

    update(delta, flightSpeed){
        this.y += .01 * delta;

        if (this.y < game.config.height/2 && this.scene.getAsteroids().length == 1){
            switch (Math.floor(Math.random() * 3)){
                case 0:
                    this.scene.addAsteroid(new AsteroidBase(this.scene, game.config.width/2, -150, 'asteroid'));
                    break;
                case 1:
                    this.scene.addAsteroid(new Comet(this.scene, game.config.width/2, -10, 'comet-var1', 1 + Math.floor(Math.random() * 3)));
                    break;
                case 2:
                    this.scene.addAsteroid(new Meteor(this.scene, game.config.width/2, -100, 'meteor', 1 + Math.floor(Math.random() * 3)));
                    break;
            }
        }
        if (this.y > game.config.height/2 && this.scene.getAsteroids().length == 1){
            if (!this.soundOnce){
                this.soundOnce = true;
                this.scene.sound.play('sfx_planet');
            }
            this.scene.bgm.volume = Math.max(this.scene.bgm.volume - (.02/delta), 0);
            this.cd += 1 * delta;
            if (this.cd > 1000){
                this.scene.flash.alpha += 0.25;
                this.cd = 0;
            }
        }
    }

    onColl(){
        scoringObject.Planets += 1;
        this.scene.spawnCD = -1000;
        this.scene.killAsteroid(this);
        this.scene.planetPresent = false;
        this.destroy();
        return this.damage;
    }
}