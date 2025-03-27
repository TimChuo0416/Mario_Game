const { ccclass, property } = cc._decorator;
declare const firebase: any;

@ccclass
export default class SelectStage extends cc.Component {

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;

    @property(cc.AudioClip)
    jumpSE: cc.AudioClip = null;

    @property(cc.AudioClip)
    tubeSE: cc.AudioClip = null;

    private level = 0;
    private rigidbody: cc.RigidBody;
    private anim: cc.Animation;

    private isLeft: boolean = false;
    private isRight: boolean = false;
    private isUp: boolean = false;
    private isDown: boolean = false;
    private isGround: boolean = true;
    private isTouch1: boolean = false;
    private isTouch2: boolean = false;
    private isOpen: boolean = false;

    private playerSpeed: number = 120;

    onLoad() {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.rigidbody = this.node.getComponent(cc.RigidBody);
        this.anim = this.node.getComponent(cc.Animation);

        this.anim.play("idle");
    }

    start() {
        // init logic
        // this.startGame();
        this.Initfirebase();
        this.Initboard();
        console.log(this.level);
        this.playMusic(this.bgm);
    }

    update(dt) {
        this.playerAnimation();
        if(this.level >= 1){
            cc.find("Canvas/2").active = true;
        }
        // console.log(this.isTouch1, this.isTouch2);
        if(this.isTouch1 || this.isTouch2){
            // console.log(this.isTouch1);
            if(this.isDown){
                if(this.isTouch1){
                    // console.log(this.level);
                    // let action = cc.sequence(cc.moveBy(1, cc.v2(0, -10)), cc.callFunc(() => {
                    //     this.stopBGM();
                    //     this.startGame1();
                    //     this.playEffect(this.tubeSE);
                    // }));
                    // this.rigidbody.type = cc.RigidBodyType.Kinematic;
                    // this.node.setSiblingIndex(1);
                    // this.node.runAction(action);
                    this.stopBGM();
                    this.startGame1();
                    this.playEffect(this.tubeSE);
                    //this.scheduleOnce(this.startGame1, 0.5)
                }
                else if(this.isTouch2){
                    // console.log(this.level);
                    this.stopBGM();
                    this.startGame2();
                    this.playEffect(this.tubeSE);
                    // let action = cc.sequence(cc.moveBy(0.5, cc.v2(0, -100)), cc.callFunc(() => {}));
                    // this.scheduleOnce(this.startGame2, 0.5)
                }
            }
        }
        if(this.isOpen && (this.node.x < 55) && (this.node.x > -55)){
            cc.find("Canvas/Board").active = true;
        }else{
            cc.find("Canvas/Board").active = false;
            this.isOpen = false;
        }
        if (this.playerSpeed > 0) { // friction
            this.playerSpeed -= 10;
        }
        else if (this.playerSpeed < 0) { // friction
            this.playerSpeed += 10;
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
    onBeginContact(contact, self, other) {
        if (other.tag == 0) {// 0 is ground
            console.log(contact.getWorldManifold().normal.y, contact.getWorldManifold().normal.x);
            if (contact.getWorldManifold().normal.y < -0.5 && contact.getWorldManifold().normal.x == 0) {
                this.isGround = true;
            }
        }else if (other.tag == 1) {// 0 is ground
            console.log(contact.getWorldManifold().normal.y, contact.getWorldManifold().normal.x);
            if (contact.getWorldManifold().normal.y < -0.5 && contact.getWorldManifold().normal.x == 0) {
                this.isGround = true;
                if(this.isDown){
                    if(other.node.name == "tube1"){
                        // this.scheduleOnce(this.startGame1, 0.5);
                        console.log("tube1");
                        this.isTouch1 = true;
                    }else if(other.node.name == "tube2" && this.level >= 1){
                        // this.scheduleOnce(this.startGame2, 0.5);
                        this.isTouch2 = true;
                    }
                }
            }
        }
    }

    onEndContact(contact, self, other) {
        if (other.tag == 0) {// is ground
            this.isGround = false;
            console.log("ground touch end");
        }
        else if(other.tag == 1){
            this.isGround = false;
            this.isTouch1 = false;
            this.isTouch2 = false;
        }
    }
    onPreSolve(contact, self, other) {
        console.log("onPreSolve");
        if (other.tag == 1) {
            console.log(contact.getWorldManifold().normal.y, contact.getWorldManifold().normal.x);
            if (contact.getWorldManifold().normal.y < -0.5 && contact.getWorldManifold().normal.x == 0) {
                this.isGround = true;
                if(this.isDown){
                    if(other.node.name == "tube1"){
                        // this.scheduleOnce(this.startGame1, 0.5);
                        console.log("tube1");
                        this.isTouch1 = true;
                    }else if(other.node.name == "tube2" && this.level >= 1){
                        // this.scheduleOnce(this.startGame2, 0.5);
                        this.isTouch2 = true;
                    }
                }
            }
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
    playerAnimation() {
        // if (this.isGround) {
        //     if (this.isLeft || this.isRight) {
        //         this.anim.play("move");
        //     } else {
        //         this.anim.play("idle");
        //     }
        // } else {
        //     this.anim.play("jump");
        // }
        if ((this.isLeft || this.isRight) && this.isGround) {
            if (!this.anim.getAnimationState("move").isPlaying && !this.anim.getAnimationState("jump").isPlaying) {
                console.log("play move");
                this.anim.play("move");
            }
        }
        else if (!this.isUp && this.isGround) {
            if (!this.anim.getAnimationState("idle").isPlaying && !this.anim.getAnimationState("jump").isPlaying) {
                console.log("play idle");
                this.anim.play("idle");
            }
        }
        if (this.isUp && this.isGround) {
            if (!this.anim.getAnimationState("jump").isPlaying) {
                console.log("play jump");
                this.anim.play("jump");
            }
        }
    }
    startGame1() {

        cc.director.loadScene("GameStart");
    }
    startGame2() {
        cc.director.loadScene("GameStart2");
    }

    Initfirebase() {
        firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                // User is signed in.
                console.log("user is signed in");
                console.log(user);
                firebase.database().ref('users/' + user.uid).once('value').then((snapshot) => {
                    var data = snapshot.val();
                    this.level = Number(data.level);
                });
            } else {
                // No user is signed in.
                console.log("no user is signed in");
                cc.director.loadScene("Signup");
            }
        });
    }
    Initboard() {
        firebase.database().ref('rank/').orderByChild('score').limitToLast(5).once('value').then((snapshot) => {
            var user = [];
            var score = [];
            snapshot.forEach((childSnapshot) => {
                user.push(childSnapshot.key);
                score.push(childSnapshot.val().score);
            });
            user.reverse();
            score.reverse();
            for (var i = 0; i < 5; i++) {
                cc.find("Canvas/Board/" + String(i + 1)).getComponent(cc.Label).string = String(i + 1);
                cc.find("Canvas/Board/" + String(i + 1) + "/user").getComponent(cc.Label).string = user[i];
                cc.find("Canvas/Board/" + String(i + 1) + "/score").getComponent(cc.Label).string = score[i];
            }
        });
    }

    onKeyDown(event) {
        //if(this.isWin) return;
        switch (event.keyCode) {
            case cc.macro.KEY.e:
                this.isOpen = !this.isOpen;
                break;
            case cc.macro.KEY.left:
                //this.direction = -1;
                this.isLeft = true;
                break;
            case cc.macro.KEY.right:
                this.isRight = true;
                break;
            case cc.macro.KEY.down:
                this.isDown = true;
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
            case cc.macro.KEY.down:
                this.isDown = false;
                break;
            case cc.macro.KEY.up:
                // this.rigidbody.linearVelocity = cc.v2(0, 0);
                this.isUp = false;
                break;
            default: break;
        }
    }
}
