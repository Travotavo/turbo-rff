class AsteroidBase extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture){
        super(scene, x, y, texture, 0);
        this.setOrigin(0.5, 1);

        scene.add.existing(this);
        this.scene = scene;

        this.damage = .5;
    }

    update(delta, flightSpeed){
        this.y += .1 * delta * flightSpeed;
    }

    onColl(){
        this.scene.killAsteroid(this);
        this.destroy();
        return this.damage;
    }
}