class Planet extends AsteroidBase {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture, 0); 
        this.play('planet-1');
        this.setOrigin(0.5, 1);
        scene.add.existing(this);
        this.setDepth(1);
        this.scene = scene;
        this.damage = 1;
    }

    update(delta, flightSpeed){
        this.y += .01 * delta;
        if (this.y < game.config.height/2 && this.scene.getAsteroids().length == 1){
            console.log();
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
    }

    onColl(){
        this.scene.killAsteroid(this);
        this.destroy();
        return this.damage;
    }
}