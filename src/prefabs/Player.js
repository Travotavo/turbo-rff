class Player extends Phaser.GameObjects.Sprite {
    static States = {
        Idle: 0,
        Accelerating: 1
    }

    constructor(scene, texture, frame, anim){
        super(scene, game.config.width/2, game.config.height/4 * 3, frame);

        scene.add.existing(this);

        //Weak state machine needed
        this.state = Player.States.Idle;


        this.scene = scene;
        this.fuel = 1;
        this.play({key: anim, repeat: -1 });
    }

    update(delta){
        if (Phaser.Input.Keyboard.JustDown(keyPress) && this.fuelCheck()){
            this.state = Player.States.Accelerating;
            this.play({key: 'Speed', repeat: -1});
        }
        if (Phaser.Input.Keyboard.JustUp(keyPress)){
            this.state = Player.States.Idle;
            this.play({key: 'Idle', repeat: -1});
        }


        if (this.state == Player.States.Accelerating){
            this.fuel -= .1/delta;
        }
        else {
            this.fuel += .01/delta;
        }
        this.fuel = Math.min(Math.max(this.fuel, 0), 1);
        this.scene.fuelRefresh();
    }

    fuelCheck(){
        if (this.fuel > 0.25){
            return true;
        }
        return false;
    }
}