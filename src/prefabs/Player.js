class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, texture, frame, anim){
        super(scene, game.config.width/2, game.config.height/4 * 3, frame);

        scene.add.existing(this);

        this.state = new IdleState(this);

        this.scene = scene;
        this.fuel = 1;
        this.play({key: anim, repeat: -1 });
    }

    //Time to implement a state machine! Woohoo!
    update(delta){
        this.handleInput();
        this.state.update(delta);

        this.fuel = Math.min(Math.max(this.fuel, 0), 1);
        this.scene.fuelRefresh();
    }

    handleInput(){
        let nextState = this.state.handleInput();
        if (nextState != null){
            this.state = nextState;
        }
    }

    fuelCheck(){
        if (this.fuel > 0.25){
            return true;
        }
        return false;
    }
}

class PlayerState {
    constructor(player){
        this.player = player;
    }
    handleInput(){}
    update(delta){}
}

class IdleState extends PlayerState{
    constructor(player){
        super(player);
    }

    handleInput(){
        if (Phaser.Input.Keyboard.JustDown(keyPress) && this.player.fuelCheck()){
            this.player.play({key: 'Speed', repeat: -1});
            return new AcceleratingState(this.player);
        }
        return null;
    }

    update(delta){
        this.player.fuel += .01/delta;
    }
}

class AcceleratingState extends PlayerState{
    constructor(player){
        super(player);
    }

    handleInput(){
        if (Phaser.Input.Keyboard.JustUp(keyPress)){
            this.player.play({key: 'Idle', repeat: -1});
            return new IdleState(this.player);
        }
        return null;
    }

    update(delta){
        console.log('Accelerating');
        this.player.fuel -= .1/delta;
    }
}