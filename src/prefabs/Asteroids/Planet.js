class Planet extends AsteroidBase {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture, 0); 
        this.play('planet-1');
        this.setOrigin(0.5, 1);
        scene.add.existing(this);
        this.scene = scene;

        this.damage = 1;
    }

    update(delta, flightSpeed){
        this.y += .01 * delta;
    }

    onColl(){
        this.scene.killAsteroid(this);
        this.destroy();
        return this.damage;
    }
}