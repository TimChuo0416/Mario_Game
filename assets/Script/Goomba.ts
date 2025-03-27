import Player from "./Player";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {

    private anim = null;
    private Speed :number = -100;
    private isDead :boolean = false;

    @property(Player)
    private player: Player = null;

    onLoad(){
        cc.director.getPhysicsManager().enabled = true;
        this.anim = this.getComponent(cc.Animation);
    }

    start () {
        this.schedule(function() { 
            this.node.scaleX *= -1;
        }, 0.15);
    }

    update (dt) {
        if(this.node.x - cc.find("Canvas/Main Camera").x < 500 && !this.isDead && !this.player.isPause){
            this.node.x += this.Speed * dt;
        }
    }

    onBeginContact(contact, self, other) {
        if(this.isDead) {
            // contact.disabled = true;
            return;
        }
        if(other.node.group == "wall"){
            if(contact.getWorldManifold().normal.y == 0 && contact.getWorldManifold().normal.x == 1)
                this.Speed *= -1;
            else if(contact.getWorldManifold().normal.y == 0 && contact.getWorldManifold().normal.x == -1)
                this.Speed *= -1;
        }
        else if(other.node.group == "player"){
            // console.log(contact.getWorldManifold().normal.y);
            if(this.player.isDead  || this.player.isPause || this.player.isShining){
                contact.disabled = true;
                return;
            }
            if(contact.getWorldManifold().normal.y == 1 && contact.getWorldManifold().normal.x == 0){
                this.isDead = true;
                this.anim.play("goomba-die");
                this.scheduleOnce(function() {
                    this.node.destroy();
                }, 0.3);
            }else{
                this.anim.pause();
            }
        }
    }

}
