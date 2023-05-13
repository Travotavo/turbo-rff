class Meteor extends AsteroidBase {
    constructor(scene, x, y, texture, hits = 1){
        super(scene, x, y, texture, 0);
        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        this.scene = scene;
        this.damage = .25;
        this.hits = hits;
        this.direction = 1;
    }

    update(delta, flightSpeed){
        
        this.y += .1 * delta * this.direction;
        this.y += .05 * delta * flightSpeed;
        this.direction += 2/delta;
        this.direction = Math.min(this.direction, 1);
        if (this.direction == 1){
            this.collides = true;
        }
    }

    onColl(){  
        this.scene.sound.play('sfx_meteor');
        if (this.hits == 0){
            this.scene.emitterMetal.explode(10);
            this.scene.killAsteroid(this);
            this.destroy();
            return this.damage;
        }
        else{
            this.scene.emitterMetal.explode(5);
            this.direction = -3 - this.hits;
            this.hits--
            this.collides = false;
            return this.damage;
        }
    }
}