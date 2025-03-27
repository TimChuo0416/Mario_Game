const {ccclass, property} = cc._decorator;
declare const firebase: any;

@ccclass
export default class Login extends cc.Component {


    onLoad(){
        //cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    }

    start () {
        // init logic
        this.InitLogin();
    }
    onKeyUp(event){
        if(event.keyCode === cc.macro.KEY.escape){
            cc.director.loadScene("Auth");
        }
    }

    InitLogin(){
        let clickEventHandler = new cc.Component.EventHandler();
        clickEventHandler.target = this.node;
        clickEventHandler.component = "Login";
        clickEventHandler.handler = "login";
        cc.find("Canvas/menu_bg/block/Login").getComponent(cc.Button).clickEvents.push(clickEventHandler);
    }

    login(){
        let email = cc.find("Canvas/menu_bg/block/email").getComponent(cc.EditBox).string;
        let password = cc.find("Canvas/menu_bg/block/password").getComponent(cc.EditBox).string;
        firebase.auth().signInWithEmailAndPassword(email, password).then(function(user){
            alert("Login Success");
            cc.director.loadScene("SelectStage");
        }).catch(function(error) {
            // Handle Errors here.
            alert(error.message);
            // console.log(error);
        });
    }
}
