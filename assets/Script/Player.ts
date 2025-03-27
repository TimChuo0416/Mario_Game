const { ccclass, property } = cc._decorator;
declare const firebase: any;

@ccclass
export default class Player extends cc.Component {

    @property(cc.Prefab)
    coinPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    mushroomPrefab: cc.Prefab = null;

    @property(cc.Prefab)
    greenPrefab: cc.Prefab = null;

    //  AUDIO
    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.AudioClip)
    jumpSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    mushroomSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerUpSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    powerDownSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    coinSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    stompSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    deadSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    kickSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    winSE: cc.AudioClip = null;


    private rigidbody: cc.RigidBody;
    private direction: number = 0;
    private isLeft: boolean = false;
    private isRight: boolean = false;
    private isUp: boolean = false;

    isPower: boolean = false;
    private isGround: boolean = false;
    isPause: boolean = false;
    isDead: boolean = false;
    isShining :boolean = false;
    isWin :boolean = false;


    private score: number = 0;
    private coin: number = 0;
    private life: number = 3;
    private timer: number = 400;
    private level: number;
    private world: number;

    private playerSpeed: number = 120;
    private anim = null;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.director.getCollisionManager().enabled = true;

        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.anim = this.node.getComponent(cc.Animation);
        this.anim.play("idle");
        this.world = Number(cc.find("Canvas/Main Camera/World/WorldNum").getComponent(cc.Label).string);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);

    }
    start() {
        // this.rigidbody.linearVelocity = cc.v2(1, 0);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 120);
        this.playMusic(this.bgm);
        this.schedule(function () {
            this.timer--;
        }, 1);
        this.Initfirebase();
    }
    update(dt) {
        // this.rigidbody.linearVelocity = cc.v2(1, 0);

        if (this.isPause) return;
        if (this.node.y - cc.find("Canvas/Main Camera").y < -330 && !this.isDead) this.playerDead();
        this.updateUI(dt);
        if (this.isDead) return;
        if(this.timer <= 0) this.playerDead();

        this.playerAnimation();
        if (this.playerSpeed > 0) { // friction
            this.playerSpeed -= 5;
        }
        else if (this.playerSpeed < 0) { // friction
            this.playerSpeed += 5;
        }
        if (this.isLeft) {
            this.playerSpeed = -250;
            if (this.node.scaleX > 0)
                this.node.scaleX *= -1;
            //this.node.getChildByName("PlayerSprite").scaleX = -1;
        } else if (this.isRight) {
            this.playerSpeed = 250;
            if (this.node.scaleX < 0)
                this.node.scaleX *= -1;
            //this.node.getChildByName("PlayerSprite").scaleX = 1;

        } if (this.isUp && this.isGround) {
            this.rigidbody.linearVelocity = cc.v2(0, 300);
            this.isGround = false;
            console.log("jump");
            // play jump effect
            this.playEffect(this.jumpSE);
        }

        this.node.x += this.playerSpeed * dt;
    }
    updateUI(dt) {
        cc.find("Canvas/Main Camera/Score").getComponent(cc.Label).string = "" + this.score;
        cc.find("Canvas/Main Camera/Coin/CoinNum").getComponent(cc.Label).string = "" + this.coin;
        cc.find("Canvas/Main Camera/Life/LifeNum").getComponent(cc.Label).string = "" + this.life;
        cc.find("Canvas/Main Camera/Time/TimeNum").getComponent(cc.Label).string = "" + this.timer;
    }
    
    onKeyDown(event) {
        //if(this.isWin) return;
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.direction = -1;
                this.isLeft = true;
                break;
            case cc.macro.KEY.right:
                this.isRight = true;
                break;
            case cc.macro.KEY.up:
                this.isUp = true;
                console.log("up");
                break;
        }
    }
    onKeyUp(event) {
        //if(this.isWin) return;
        switch (event.keyCode) {
            case cc.macro.KEY.left:
                this.isLeft = false;
                break;
            case cc.macro.KEY.right:
                this.isRight = false;
                break;
            case cc.macro.KEY.up:
                // this.rigidbody.linearVelocity = cc.v2(0, 0);
                this.isUp = false;
                break;
            default: break;
        }
    }
    playEffect(effect) {
        cc.audioEngine.playEffect(effect, false);
    }
    playMusic(music) {
        cc.audioEngine.playMusic(music, true);
    }
    stopBGM() {
        cc.audioEngine.stopMusic();
    } 

    Initfirebase(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              console.log("user is signed in");
              console.log(user);
              firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
                var data = snapshot.val();
                this.score = Number(data.score);
                this.coin = Number(data.coin);
                this.life = Number(data.life);
                this.level = Number(data.level);
              });
            } else {
              // No user is signed in.
              console.log("no user is signed in");
              cc.director.loadScene("Signup");
            }
        });
    }

    Updatefirebase(){
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
              // User is signed in.
              console.log("user is signed in");
              console.log(user);
              
              firebase.database().ref('rank/' + user.displayName).once('value').then((snapshot) => {
                var data = snapshot.val();
                if(data == null){
                    firebase.database().ref('rank/' + user.displayName).update({
                        score: this.score
                    });
                }
                else{
                    if(this.score > data.score){
                        firebase.database().ref('rank/' + user.displayName).update({
                            score: this.score
                        });
                    }
                }
              });
              if(this.life <= 0){
                firebase.database().ref('users/' + user.uid).update({
                    score: 0,
                    coin: 0,
                    life: 3,
                    level: 0
                });
              }
              else if (this.world <= this.level){
                firebase.database().ref('users/' + user.uid).update({
                    score: this.score,
                    coin: this.coin,
                    life: this.life,
                    level: this.level
                  });
              }
              
            } else {
              // No user is signed in.
              console.log("no user is signed in");
              cc.director.loadScene("Menu");
            }
        });
    }

    onBeginContact(contact, self, other) {
        if (this.isDead) {
            contact.disabled = true;
            return;
        }
        else if(this.isPause){
            return;
        }
        if (other.tag == 0) {// 0 is ground
            console.log(contact.getWorldManifold().normal.y, contact.getWorldManifold().normal.x);
            if (contact.getWorldManifold().normal.y < -0.5 && contact.getWorldManifold().normal.x == 0) {
                this.isGround = true;
            }
        }
        else if (other.tag == 1) {// 1 is block
            console.log("block touch");
            if (contact.getWorldManifold().normal.y < -0.5 && contact.getWorldManifold().normal.x == 0) {
                this.isGround = true;
            }
        }
        else if (other.tag == 2) {// 2 is platform
            console.log("player touch platform");
            if (contact.getWorldManifold().normal.y < -0.5 && contact.getWorldManifold().normal.x == 0) {
                this.isGround = true;
                // console.log(contact.getWorldManifold().normal.y, contact.getWorldManifold().normal.x);
            }
            else {
                contact.disabled = true;
            }
        }
        else if (other.tag == 3) {// 3 is questionbox
            console.log("player touch questionbox");
            if (contact.getWorldManifold().normal.y < -0.5 && contact.getWorldManifold().normal.x == 0) {
                this.isGround = true;
            }
            else if (contact.getWorldManifold().normal.y == 1 && contact.getWorldManifold().normal.x == 0) {

                if (other.node.name == "questionBox") {
                    let mushroom = cc.instantiate(this.mushroomPrefab);
                    mushroom.setPosition(other.node.x, other.node.y + 30);
                    // let action = cc.moveBy(1, cc.v2(0, 100));
                    // mushroom.runAction(action);
                    cc.find("Canvas").addChild(mushroom);
                    console.log("mushroom");
                } else if(other.node.name == "questionBoxGreen"){
                    let green = cc.instantiate(this.greenPrefab);
                    green.setPosition(other.node.x, other.node.y + 30);
                    cc.find("Canvas").addChild(green);
                    console.log("green");
                }else {
                    this.addCoin(other);
                }
                other.tag = 1;
                this.blockAnimation(other.node);
            }
        }
        else if (other.tag == 4) { // 4 is mushroom
            console.log("player touch mushroom");
            this.eatmushroom(other);
            if (!this.isPower)
                this.powerUp();
        }
        else if (other.tag == 5) { // 5 is goomba
            console.log("player touch goomba");
            if(this.isShining){
                contact.disabled = true;
            }
            else if (contact.getWorldManifold().normal.y == -1 && contact.getWorldManifold().normal.x == 0) {
                this.playEffect(this.stompSE);
                this.rigidbody.linearVelocity = cc.v2(0, 200);
                this.isGround = false;
                this.addScore(100);

            }
            else {
                if (this.isPower) {
                    this.powerDown();
                } else {
                    this.playerDead();
                }
            }
        }else if (other.tag == 6) { // 6 is turtle
            console.log("player touch turtle");
            if(this.isShining){
                contact.disabled = true;
            }
            else if (contact.getWorldManifold().normal.y == -1 && contact.getWorldManifold().normal.x == 0) {
                this.playEffect(this.stompSE);
                this.rigidbody.linearVelocity = cc.v2(0, 200);
                this.isGround = false;
                this.addScore(100);
            }
        }else if(other.tag == 7){ // 7 is green mushroom
            console.log("player touch green mushroom");
            this.eatmushroom(other);
            this.life++;
            this.Updatefirebase();
        }else if(other.tag == 9){ // 9 is flag
            console.log("player touch flag");
            this.win();
        }
            
    }
    onEndContact(contact, self, other) {
        if (other.tag == 0) {// is ground
            this.isGround = false;
            console.log("ground touch end");
        }
        if (other.tag == 2) {// 2 is platform
            this.isGround = false;
            console.log("block touch end");
        }
    }
    playerAnimation() {
        // if(!this.isGround){
        //     if (this.isPower) {
        //         if (!this.anim.getAnimationState("big-jump").isPlaying) {
        //             console.log("play big-jump");
        //             this.anim.play("big-jump");
        //         }
        //     }
        //     else {
        //         if (!this.anim.getAnimationState("jump").isPlaying) {
        //             console.log("play jump");
        //             this.anim.play("jump");
        //         }
        //     }
        // }
        if ((this.isLeft || this.isRight) && this.isGround) {
            if (this.isPower) {
                if (!this.anim.getAnimationState("big-move").isPlaying && !this.anim.getAnimationState("big-jump").isPlaying) {
                    console.log("play big-move");
                    this.anim.play("big-move");
                }
            }
            else {
                if (!this.anim.getAnimationState("move").isPlaying && !this.anim.getAnimationState("jump").isPlaying) {
                    console.log("play move");
                    this.anim.play("move");
                }
            }
        }
        else if (!this.isUp && this.isGround) {
            if (this.isPower) {
                if (!this.anim.getAnimationState("big-idle").isPlaying && !this.anim.getAnimationState("big-jump").isPlaying) {
                    console.log("play big-idle");
                    this.anim.play("big-idle");
                }
            }
            else {
                if (!this.anim.getAnimationState("idle").isPlaying && !this.anim.getAnimationState("jump").isPlaying) {
                    console.log("play idle");
                    this.anim.play("idle");
                }
            }
        }
        if (this.isUp && this.isGround) {
            if (this.isPower) {
                if (!this.anim.getAnimationState("big-jump").isPlaying) {
                    console.log("play big-jump");
                    this.anim.play("big-jump");
                }
            }
            else {
                if (!this.anim.getAnimationState("jump").isPlaying) {
                    console.log("play jump");
                    this.anim.play("jump");
                }
            }
        }
    }
    playerDead() {
        this.isDead = true;
        this.life -= 1;
        this.Updatefirebase();
        this.rigidbody.linearVelocity = cc.v2(0, 0);
        this.rigidbody.gravityScale = 0;
        let action = cc.sequence(cc.delayTime(0.5), cc.callFunc(function () {
            this.rigidbody.gravityScale = 1; 
            this.rigidbody.linearVelocity = cc.v2(0, 300);
            this.scheduleOnce(function () {
                if(this.world == 1){
                    cc.director.loadScene("GameStart");
                }
                else{
                    cc.director.loadScene("GameStart2");
                }
            }, 2);

        }, this));
        // this.node.runAction(action);
        this.stopBGM();
        this.playEffect(this.deadSE);
        this.anim.play("die");
        this.node.runAction(action);
        // this.rigidbody.linearVelocity = cc.v2(0, 300);
        // this.scheduleOnce(function () {
        //     cc.director.loadScene("GameStart");
        // }, 2);
    }
    addCoin(other) {
        
        let coin = cc.instantiate(this.coinPrefab);
        coin.setPosition(other.node.x, other.node.y + 30);
        let action = cc.sequence(
            cc.moveBy(0.2, cc.v2(0, 80)),
            cc.moveBy(0.2, cc.v2(0, -50)),
            cc.callFunc(function (target) {
                target.destroy();
            }, this)
        );
        cc.find("Canvas").addChild(coin);
        coin.runAction(action);
        this.playEffect(this.coinSE);
        this.coin += 10;
        this.addScore(100);
    }
    addScore(num) {
        this.score += num;
    }
    powerUp() {
        this.playEffect(this.powerUpSE);
        this.isPower = true;
        this.isPause = true;
        this.rigidbody.gravityScale = 0;
        this.rigidbody.linearVelocity = cc.v2(0, 0);        
        let finish = cc.callFunc(function (target) {
            this.isPause = false;
            this.rigidbody.gravityScale = 1;
        }, this);
        let action = cc.sequence(
            cc.repeat(
                cc.sequence(
                    cc.scaleBy(0.1, 1.15),
                    cc.hide(),
                    cc.delayTime(0.05),
                    cc.show(),
                    cc.scaleBy(0.1, 0.87)
                ),
            3), cc.scaleBy(0.1,0.85,1.3),finish
        );
        this.node.runAction(action);
        this.anim.play("big-idle");
    }
    powerDown() {
        this.playEffect(this.powerDownSE);
        this.isPower = false;
        this.isShining = true;
        this.isPause = true;
        this.rigidbody.gravityScale = 0;
        this.rigidbody.linearVelocity = cc.v2(0, 0);
        let finish = cc.callFunc(function (target) {
            this.isPause = false;
            this.rigidbody.gravityScale = 1;
            let action = cc.blink(1.5, 4);
            this.node.runAction(action);
        }, this);
        let action = cc.sequence(
            cc.repeat(
                cc.sequence(
                    cc.scaleBy(0.1, 0.87),
                    cc.hide(),
                    cc.delayTime(0.05),
                    cc.show(),
                    cc.scaleBy(0.1, 1.15)
                ),
            3), cc.scaleBy(0.1,1.2,0.77),finish,cc.delayTime(1.5),cc.callFunc(function (target) {
                this.isShining = false;
            }, this)
        );
        this.node.runAction(action);
        this.anim.play("jump"); 
    }
    eatmushroom(other) {
        // add score
        this.addScore(300);
        // destory mushroom
        // let destroy = cc.callFunc(function(target) {
        //     other.node.destroy(); 
        // }, this);
        other.node.destroy();
    }

    blockAnimation(node) {
        let action = cc.sequence(cc.moveBy(0.1, cc.v2(0, 5)), cc.moveBy(0.1, cc.v2(0, -5)));
        //play animation "box" for node
        node.getComponent(cc.Animation).play("box");
        node.runAction(action);
    }
    flip(){
        this.node.scaleX *= -1;
    }
    win(){
        this.stopBGM();
        this.rigidbody.gravityScale = 0.5;
        this.isPause = true;
        if(this.world > this.level){
            this.level++;
        }
        if(this.isPower){
            this.anim.play("big-win");
        }
        else{
            this.anim.play("win");
        }
        this.playEffect(this.winSE);
        // this.rigidbody.linearVelocity = cc.v2(0, -100);
        this.score += Math.floor(this.timer * 5);
        // this.anim.play("win");
        this.Updatefirebase();
        this.scheduleOnce(function () {
            console.log(this.level);
            if(this.level >= 2){
                cc.director.loadScene("Menu");
            }
            else{
                cc.director.loadScene("SelectStage");
            }
        }, 3.5);
    }
}
