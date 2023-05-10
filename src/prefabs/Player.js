class Player extends Phaser.GameObjects.Sprite {
    constructor(scene, texture, frame, anim){
        super(scene, game.config.width/2, game.config.height/4 * 3, frame);

        scene.add.existing(this);

        this.fuel = 1.0;
        this.play({key: anim, repeat: -1 });
    }

    update(){
        console.log(this.fuel);
        this.fuel = this.fuel/10;
        console.log("Flex! Fuel used. Fuel at: ", this.fuel);
    }
}