class Comet extends AsteroidBase {
    constructor(scene, x, y, texture, exCount){
        
        super(scene, x, y, texture, 0);
        this.setOrigin(0.5, 1);
        this.play('comet-1');
        if (exCount > 0){
            scene.addAsteroid(new Comet(scene, x + (Math.random() * 15) -5, y - 50, texture, exCount - 1));
        }

        scene.add.existing(this);
        this.scene = scene;

        this.damage = .1;
    }

    update(delta, flightSpeed){
        this.y += .15 * delta * flightSpeed;
    }

    onColl(){
        this.scene.killAsteroid(this);
        this.destroy();
        return this.damage;
    }
}