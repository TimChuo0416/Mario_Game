import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Turtle extends cc.Component {

    private anim = null;
    private Speed :number = -100;
    private isDead :boolean = false;
    private turtleState :number = 0;

    @property(Player)
    private player: Player = null;

    onLoad(){
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.anim.play("turtle-idle");
    }

    update (dt) {
        if(this.node.x - cc.find("Canvas/Main Camera").x < 500 && !this.isDead && !this.player.isPause ){
            this.node.x += this.Speed * dt;
        }
    }

    onBeginContact(contact, self, other) {
        
        if(other.node.group == "wall"){
            console.log("turn");
            if(contact.getWorldManifold().normal.y == 0 && contact.getWorldManifold().normal.x == 1){
                console.log("x = 1");
                this.Speed *= -1;
                this.node.scaleX *= -1;
            }
            else if(contact.getWorldManifold().normal.y == 0 && contact.getWorldManifold().normal.x == -1){
                console.log("x = -1");
                this.Speed *= -1;
                this.node.scaleX *= -1;
            }
        }
        else if(other.node.group == "player"){
            // console.log(contact.getWorldManifold().normal.y);
            
            if(this.player.isDead || this.player.isPause || this.player.isShining){
                contact.disabled = true;
                return;
            }
            if(contact.getWorldManifold().normal.y == 1 && contact.getWorldManifold().normal.x == 0){
                if(this.turtleState == 0){
                    this.turtleState = 1;
                    this.anim.play("turtle-hide");
                    this.Speed = 0;
                }
                else if(this.turtleState == 1){
                    this.turtleState = 2;
                    this.anim.play("turtle-turn");
                    if(self.node.x <= other.node.x) { // kick - left move
                        this.Speed = -500;
                        this.turtleState = 2;
                        this.player.playEffect(this.player.kickSE);
                    }else { // kick - right move
                        this.Speed = 500;
                        this.turtleState = 2;
                        this.player.playEffect(this.player.kickSE);
                    }
                }
            }else{
                if(this.turtleState == 2 || this.turtleState == 0){
                    if(this.player.isPower){
                        this.player.powerDown();
                    }else{
                        this.player.playerDead();
                    }
                }
                else if(this.turtleState == 1){
                    this.turtleState = 2;
                    this.anim.play("turtle-turn");
                    if(self.node.x <= other.node.x) { // kick - left move
                        this.Speed = -500;
                        this.turtleState = 2;
                        this.player.playEffect(this.player.kickSE);
                    }else { // kick - right move
                        this.Speed = 500;
                        this.turtleState = 2;
                        this.player.playEffect(this.player.kickSE);
                    }
                }
            }
        }
    }

}
