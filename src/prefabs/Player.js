class Player extends Phaser.GameObjects.Sprite {

    constructor(scene, frame, anim){
        super(scene, game.config.width/2, game.config.height/4 * 3, frame);

        this.setOrigin(0.5, 0);
        scene.add.existing(this);

        this.state = new IdleState(this, 250);

        this.release = true;

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
        if (Phaser.Input.Keyboard.JustUp(keyPress)){
            this.release = true;
        }
        if (Phaser.Input.Keyboard.JustDown(keyPress)){
            this.release = false;
        }

        let nextState = this.state.handleInput(this.release);
        if (nextState != null){
            this.prevState = this.state
            this.state = nextState;
        }
    }

    //Check if player collides with asteroid
    collCheck(forgiveness = 0){
        let objects = this.scene.getAsteroids();
        for (let i of objects){
            if (i.y + forgiveness > this.y){
                return i;
            }
        }
        // Make it return the asteroid or null in future
        return null;
    }

    //Disables use of boost below fuel threshold
    fuelCheck(){
        if (this.fuel > 0.25){
            return true;
        }
        return false;
    }
}

class PlayerState {
    constructor(player, cd, time = 0){
        this.player = player;
        this.time = time;
        this.cd = cd;
        this.hasCD = false;
    }
    handleInput(releaseStatus){}
    update(delta){
        this.time += delta;
        if (this.time > this.cd){
            this.hasCD = true;
        }
    }
}

class IdleState extends PlayerState{
    constructor(player, time = 0){
        super(player, 250, time);
    }

    handleInput(release){
        if (!release && this.hasCD && this.player.fuelCheck()){
            this.player.play({key: 'Blank', repeat: -1});
            return new ParryState(this.player);
        }
        return null;
    }

    update(delta){
        super.update(delta);
        this.player.fuel += .01/delta;
        this.collide = this.player.collCheck(-4);
        if (this.collide != null){
            this.player.fuel -= this.collide.onColl();
            
            console.log("You lose!");
        }
        if (this.player.scene.flightSpeed > 1){
            this.player.scene.flightSpeed -= .1/delta;
        }
    }
}

class AcceleratingState extends PlayerState{
    constructor(player){
        super(player, 10, 0);
        this.hasCD = false;
    }

    handleInput(release){
        
        if (release && this.hasCD){
            this.player.play({key: 'Idle', repeat: -1});
            return new IdleState(this.player);
        }
        return null;
    }

    update(delta){
        super.update(delta);
        this.player.fuel -= .1/delta;
        this.collide = this.player.collCheck(5);
        if (this.collide != null){
            this.collide.onColl();
        }
        if (this.player.scene.flightSpeed < 3){
            this.player.scene.flightSpeed += .1/delta;
        }
    }
}

class ParryState extends PlayerState{
    constructor(player){
        super(player, 10, 0);
        this.collide = null;
    }

    handleInput(){
        if (this.collide != null){
            this.collide.onColl();
            this.player.play({key: 'Turbo', repeat: -1});
            return new BoostState(this.player);
        }
        if (this.hasCD){
            this.player.play({key: 'Speed', repeat: -1});
            return new AcceleratingState(this.player);
        }
    }
    
    update(delta){
        super.update(delta);
        this.collide = this.player.collCheck(5);
        if (this.player.scene.flightSpeed < 3){
            this.player.scene.flightSpeed += .2/delta;
        }
    }
}

class BoostState extends PlayerState{
    constructor(player){
        super(player, 500, 0);
    }

    handleInput(release){
        if (this.hasCD){
            if (release){
                this.player.play({key: 'Idle', repeat: -1});
                return new IdleState(this.player, 250);
            }
            this.player.play({key: 'Speed', repeat: -1});
            return new AcceleratingState(this.player);
        }
    }

    update(delta){
        super.update(delta);
        this.player.fuel += .01/delta;
        this.collide = this.player.collCheck(5);
        if (this.collide != null){
            this.collide.onColl();
        }
        if (this.player.scene.flightSpeed < 3){
            this.player.scene.flightSpeed += .3/delta;
        }
    }
}