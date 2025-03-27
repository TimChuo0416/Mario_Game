const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class Signup extends cc.Component {

    onLoad(){
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }
    start () {
        // init logic
        this.InitSignup();
    }
    onKeyUp(event){
        if(event.keyCode === cc.macro.KEY.escape){
            cc.director.loadScene("Auth");
        }
    }
    InitSignup(){
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Signup";
        clickEventHandler.handler = "signup";
        cc.find("Canvas/menu_bg/block/Signup").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }
    signup(){
        let username = cc.find("Canvas/menu_bg/block/username").getComponent(cc.EditBox).string;
        let email = cc.find("Canvas/menu_bg/block/email").getComponent(cc.EditBox).string;
        let password = cc.find("Canvas/menu_bg/block/password").getComponent(cc.EditBox).string;
        //console.log(email, password);
        firebase.auth().createUserWithEmailAndPassword(email, password).then(function(auth){
            console.log(auth.user.uid);
            firebase.database().ref('users/' + auth.user.uid).set({
                username: username,
                email: email,
                password: password,
                life:3,
                score:0,
                coin:0,
                level:0
            })
            auth.user.updateProfile({
                displayName: username
            })
            firebase.database().ref('rank/' + username).set({
                score: 0
            }).then(function(){
                console.log("success");
                alert("Signup Success");
                cc.director.loadScene("SelectStage");
            });
        }).catch(function(error) {
            // Handle Errors here.
            alert(error.message);
            // console.log(error);
        });
        
    }
}
